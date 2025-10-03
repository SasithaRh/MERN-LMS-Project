import { v2 as cloudinary } from 'cloudinary';

//configure with env data
cloudinary.config({
  cloud_name: "dryhlzadw",
  api_key: "874134426531479",
  api_secret: "9mmbs3FPwyUaNhFrod0N_14JQA8",
});

export const uploadMediaToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading to cloudinary");
  }
};

export  const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
    throw new Error("failed to delete assest from cloudinary");
  }
};

