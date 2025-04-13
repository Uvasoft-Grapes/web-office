import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

export const uploadImage = async (imageFile:File) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const res = await axiosInstance.post(API_PATHS.AUTH.UPLOAD_IMAGE, formData, {
      headers:{
        "Content-Type":"multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error uploading the image", error);
    throw error;
  };
};