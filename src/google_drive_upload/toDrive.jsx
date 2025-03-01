import { useState } from "react";

const UploadToDrive = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Fayl tanlang!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5173/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.fileId) {
        setMessage(`Fayl yuklandi! Google Drive ID: ${data.fileId}`);
      } else {
        setMessage("Fayl yuklashda xatolik!");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      setMessage("Xatolik yuz berdi!");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 min-h-screen text-white">
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleUpload} className="bg-blue-500 p-2 rounded">
        Google Drive'ga yuklash
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default UploadToDrive;
