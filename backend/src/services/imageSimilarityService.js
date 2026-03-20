import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";

let modelPromise;
const TF_WARNING_SNIPPET = "looks like you are running TensorFlow.js in Node.js";

const loadModel = async () => {
  if (!modelPromise) {
    modelPromise = mobilenet.load({ version: 2, alpha: 1.0 });
  }

  return modelPromise;
};

const fetchImageBuffer = async (imageUrl) => {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error("Unable to fetch image for similarity matching.");
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

export const createImageEmbedding = async (imageUrl) => {
  return withSuppressedTfWarning(async () => {
    const model = await loadModel();
    const buffer = await fetchImageBuffer(imageUrl);
    const decoded = decodeImage(buffer);
    const tensor = tf.tensor3d(decoded.data, [decoded.height, decoded.width, 4], "int32");
    const rgbTensor = tf.slice(tensor, [0, 0, 0], [decoded.height, decoded.width, 3]);
    const resized = tf.image.resizeBilinear(rgbTensor, [224, 224]);
    const normalized = resized.toFloat().div(255);
    const batched = normalized.expandDims(0);
    const embeddingTensor = model.infer(batched, true);
    const embedding = Array.from(await embeddingTensor.data());

    tf.dispose([tensor, rgbTensor, resized, normalized, batched, embeddingTensor]);

    return embedding;
  });
};

const decodeImage = (buffer) => {
  if (buffer[0] === 0x89 && buffer[1] === 0x50) {
    return PNG.sync.read(buffer);
  }

  return jpeg.decode(buffer, { useTArray: true });
};

const cosineSimilarity = (a, b) => {
  if (!a.length || !b.length || a.length !== b.length) {
    return 0;
  }

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let index = 0; index < a.length; index += 1) {
    dot += a[index] * b[index];
    magA += a[index] * a[index];
    magB += b[index] * b[index];
  }

  if (!magA || !magB) {
    return 0;
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "at",
  "the",
  "of",
  "near",
  "in",
  "on",
  "with",
  "for",
  "to",
  "from",
  "my",
  "is",
  "it",
  "this",
  "that",
  "black",
  "blue",
  "silver"
]);

const tokenize = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));

const overlapScore = (leftTokens, rightTokens) => {
  const leftSet = new Set(leftTokens);
  const rightSet = new Set(rightTokens);

  if (!leftSet.size || !rightSet.size) {
    return 0;
  }

  let intersection = 0;
  leftSet.forEach((token) => {
    if (rightSet.has(token)) {
      intersection += 1;
    }
  });

  return intersection / Math.max(leftSet.size, rightSet.size);
};

const buildTextSignals = (sourceItem, candidate) => {
  const sourceTitleTokens = tokenize(sourceItem.title);
  const candidateTitleTokens = tokenize(candidate.title);
  const sourceDescriptionTokens = tokenize(sourceItem.description);
  const candidateDescriptionTokens = tokenize(candidate.description);
  const sourceLocationTokens = tokenize(sourceItem.location);
  const candidateLocationTokens = tokenize(candidate.location);

  const titleScore = overlapScore(sourceTitleTokens, candidateTitleTokens);
  const descriptionScore = overlapScore(sourceDescriptionTokens, candidateDescriptionTokens);
  const locationScore = overlapScore(sourceLocationTokens, candidateLocationTokens);
  const allKeywordScore = overlapScore(
    [...sourceTitleTokens, ...sourceDescriptionTokens],
    [...candidateTitleTokens, ...candidateDescriptionTokens]
  );

  return {
    titleScore,
    descriptionScore,
    locationScore,
    allKeywordScore
  };
};

const calculateHybridScore = (sourceItem, candidate) => {
  const imageScore = cosineSimilarity(sourceItem.imageEmbedding, candidate.imageEmbedding);
  const textSignals = buildTextSignals(sourceItem, candidate);

  let score =
    imageScore * 0.55 +
    textSignals.titleScore * 0.25 +
    textSignals.locationScore * 0.15 +
    textSignals.descriptionScore * 0.05;

  // Strongly penalize visually similar but semantically unrelated items.
  if (textSignals.titleScore === 0 && textSignals.allKeywordScore === 0) {
    score -= 0.28;
  }

  if (textSignals.locationScore === 0) {
    score -= 0.08;
  }

  return {
    imageScore,
    ...textSignals,
    score: Math.max(0, Math.min(1, score))
  };
};

export const rankSimilarItems = (sourceItem, candidates = []) =>
  candidates
    .map((candidate) => {
      const hybrid = calculateHybridScore(sourceItem, candidate);

      return {
        item: candidate,
        similarity: hybrid.score,
        imageSimilarity: hybrid.imageScore,
        titleScore: hybrid.titleScore,
        locationScore: hybrid.locationScore
      };
    })
    .filter(
      (entry) =>
        entry.similarity >= 0.62 &&
        (entry.titleScore > 0 || entry.locationScore > 0 || entry.imageSimilarity > 0.985)
    )
    .sort((left, right) => right.similarity - left.similarity)
    .slice(0, 6);

const withSuppressedTfWarning = async (callback) => {
  const originalWarn = console.warn;

  console.warn = (...args) => {
    const message = args.join(" ");
    if (message.includes(TF_WARNING_SNIPPET)) {
      return;
    }

    originalWarn(...args);
  };

  try {
    return await callback();
  } finally {
    console.warn = originalWarn;
  }
};
