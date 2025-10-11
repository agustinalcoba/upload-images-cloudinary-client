import { useEffect, useRef, useState } from "react";
import axios from "./api/axios";
import { ImagesList } from "./components/ImagesList";

function App() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const imgInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(
    "https://placehold.co/384?text=Click+here"
  ); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    (async () => {
      await refreshUploadedImages();
    })();
  }, []);

  const refreshUploadedImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/images");
      setUploadedImages(response.data);
    } catch (error) {
      if (!error.response) {
        setErrorMsg("Server error");
      }
      console.error(error);
    }
    setLoading(false);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const validExtensions = ["jpg", "jpeg", "png", "mp4"]; // Extensiones permitidas
    const fileExtension = file?.name.split(".").pop().toLowerCase(); // Obtener la extensión del archivo

    if (file) {
      if (!validExtensions.includes(fileExtension)) {
        setErrorMsg(
          "Extensión de archivo no permitida. Solo se permiten: " +
            validExtensions.join(", ")
        );
        setSelectedFile(null);
      } else {
        setImage(URL.createObjectURL(file));
        setErrorMsg("");
        setSelectedFile(file);
      }
    }
  };
  const hanldeSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const name = e.target.name.value;

    if (!name) {
      setErrorMsg("Debes ingresar un nombre");
      return;
    }

    if (!selectedFile) {
      setErrorMsg("Debes seleccionar una imagen");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", name);
    try {
      setLoading(true);
      const response = await axios.post("/api/uploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Reset image state
      setImage(response.data.url);
      refreshUploadedImages();
    } catch (error) {
      if (error.response.status == 400) {
        setErrorMsg(error.response.data);
      }
      console.error(error);
    }
    setLoading(false);
  };
  const handleReset = (e) => { 
    setImage("https://placehold.co/384?text=Click+here");
  };
  return (
    <main className="relative max-w-screen-lg mx-auto p-4 pt-16">
      <p
        className={
          loading
            ? "fixed top-4 right-0 left-0 mx-auto p-4 border border-green-500 bg-green-200 text-green-500 w-fit rounded-md"
            : "hidden"
        }
      >
        Loading...
      </p>
      <form
        className="flex flex-col gap-2 items-center w-fit mx-auto"
        onSubmit={hanldeSubmit}
        onReset={handleReset}
      >
        <p className={errorMsg ? "p-4 bg-red-400" : "hidden"}>{errorMsg}</p>
        <img
          className="size-96 object-cover cursor-pointer"
          src={image}
          alt=""
          onClick={() => {
            imgInputRef.current.click();
          }}
        />
        <input
          className="hidden"
          onChange={handleImageChange}
          type="file"
          name="file"
          ref={imgInputRef}
          accept="image/png,image/jpeg,image/jpg"
        />
        <input
          className="w-full outline-none py-2 px-4 bg-slate-100 rounded-md"
          type="text" 
          name="name"
          autoComplete="off" 
          placeholder="Name"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-md bg-blue-500 text-white px-4 py-2"
          >
            Upload
          </button>
          <button
            type="reset"
            className="rounded-md border-2 border-blue-500 text-blue-500 px-4 py-2"
          >
            Reset
          </button>
        </div>
      </form>
      <ImagesList
        uploadedImages={uploadedImages}
        setLoading={setLoading}
        refreshUploadedImages={refreshUploadedImages}
      />
    </main>
  );
}

export default App;
