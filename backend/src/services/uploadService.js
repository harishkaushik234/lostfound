import cloudinary from "../config/cloudinary.js";

export const uploadBufferToCloudinary = async (buffer, folder = "lost-found") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });

export const deleteCloudinaryAsset = async (publicId) => {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
};
