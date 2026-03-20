import mongoose from "mongoose";
import cloudinary from "./config/cloudinary.js";
import { connectDb } from "./config/db.js";
import { Conversation } from "./models/Conversation.js";
import { Item } from "./models/Item.js";
import { Message } from "./models/Message.js";
import { User } from "./models/User.js";
import { createImageEmbedding } from "./services/imageSimilarityService.js";

const sampleUsers = [
  {
    name: "Aarav Sharma",
    email: "aarav@example.com",
    password: "password123",
    bio: "Lost my college backpack near the metro station."
  },
  {
    name: "Meera Patel",
    email: "meera@example.com",
    password: "password123",
    bio: "Usually reports found items around Koramangala and MG Road."
  },
  {
    name: "Rohan Verma",
    email: "rohan@example.com",
    password: "password123",
    bio: "Helping reunite gadgets and accessories with their owners."
  }
];

const sampleItems = [
  {
    ownerEmail: "aarav@example.com",
    title: "Black Nike Backpack",
    description: "Lost near the Indiranagar Metro entrance. Contains notebooks and a charger.",
    location: "Bengaluru - Indiranagar",
    category: "lost",
    status: "open",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  },
  {
    ownerEmail: "meera@example.com",
    title: "Found Black Backpack",
    description: "Found a black bag near the metro stairs with books inside.",
    location: "Bengaluru - Indiranagar",
    category: "found",
    status: "open",
    imageUrl:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80"
  },
  {
    ownerEmail: "rohan@example.com",
    title: "Lost Silver iPhone",
    description: "Lost in a cab between HSR Layout and Silk Board.",
    location: "Bengaluru - HSR Layout",
    category: "lost",
    status: "open",
    imageUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"
  },
  {
    ownerEmail: "meera@example.com",
    title: "Found iPhone Near Cafe",
    description: "Found a silver phone on a cafe table, lock screen still active.",
    location: "Bengaluru - HSR Layout",
    category: "found",
    status: "open",
    imageUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"
  },
  {
    ownerEmail: "aarav@example.com",
    title: "Lost Blue Water Bottle",
    description: "Metal bottle left in the college library yesterday evening.",
    location: "Bengaluru - Malleshwaram",
    category: "lost",
    status: "resolved",
    imageUrl:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80"
  },
  {
    ownerEmail: "rohan@example.com",
    title: "Found Blue Bottle",
    description: "Reusable blue bottle found near the reading area.",
    location: "Bengaluru - Malleshwaram",
    category: "found",
    status: "resolved",
    imageUrl:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80"
  }
];

const uploadSeedImage = async (remoteUrl, fileName) => {
  const result = await cloudinary.uploader.upload(remoteUrl, {
    folder: "lost-found/seed",
    public_id: fileName,
    overwrite: true
  });

  return {
    imageUrl: result.secure_url,
    imagePublicId: result.public_id
  };
};

const createSeedData = async () => {
  await connectDb();

  await Promise.all([
    Conversation.deleteMany({}),
    Message.deleteMany({}),
    Item.deleteMany({}),
    User.deleteMany({})
  ]);

  const users = await User.create(sampleUsers);
  const userMap = new Map(users.map((user) => [user.email, user]));

  const createdItems = [];

  for (const [index, item] of sampleItems.entries()) {
    const owner = userMap.get(item.ownerEmail);
    const upload = await uploadSeedImage(item.imageUrl, `sample-${index + 1}`);
    const embedding = await createImageEmbedding(upload.imageUrl);

    const createdItem = await Item.create({
      user: owner._id,
      title: item.title,
      description: item.description,
      location: item.location,
      category: item.category,
      status: item.status,
      imageUrl: upload.imageUrl,
      imagePublicId: upload.imagePublicId,
      imageEmbedding: embedding
    });

    createdItems.push(createdItem);
  }

  const backpackConversation = await Conversation.create({
    participants: [userMap.get("aarav@example.com")._id, userMap.get("meera@example.com")._id],
    item: createdItems[1]._id,
    lastMessage: "Yes, it has a maths notebook and a black charger.",
    lastMessageAt: new Date()
  });

  await Message.create([
    {
      conversation: backpackConversation._id,
      sender: userMap.get("aarav@example.com")._id,
      content: "Hi, is the backpack still with you?"
    },
    {
      conversation: backpackConversation._id,
      sender: userMap.get("meera@example.com")._id,
      content: "Yes, I still have it. Can you tell me what is inside?"
    },
    {
      conversation: backpackConversation._id,
      sender: userMap.get("aarav@example.com")._id,
      content: "Yes, it has a maths notebook and a black charger."
    }
  ]);

  console.log("Seed complete");
  console.log("Test login: aarav@example.com / password123");
  console.log("Test login: meera@example.com / password123");
  console.log("Test login: rohan@example.com / password123");
};

createSeedData()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
