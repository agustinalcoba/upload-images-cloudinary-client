import { useEffect, useState } from "react";
import axios from "../api/axios";

export const ImagesList = ({
  setLoading,
  refreshUploadedImages,
  uploadedImages,
}) => {
  const deleteImage = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/image/${id}`);
      console.log("Image deleted successfully");
      await refreshUploadedImages();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  return (
    <>
      <section className="p-4">
        <h2 className="border-b p-4 text-2xl text-center">Uploaded Images</h2>
        {uploadedImages.length > 0 ? (
          <div className=" flex flex-wrap justify-center items-center p-4 gap-4 mx-auto  ">
            {uploadedImages.map((image, i) => (
              <article className="border pb-4" key={i}>
                <img className="" src={image.url} alt="" />
                <p className="p-4 text-2xl">{image.name}</p>
                <button
                  className="bg-red-500 text-white text-xl px-4 py-2 rounded-md mx-auto block"
                  onClick={() => deleteImage(image.id)}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="p-4 text-center">No images uploaded yet...</p>
        )}
      </section>
    </>
  );
};
