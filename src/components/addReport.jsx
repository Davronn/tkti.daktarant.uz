import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import jsPDF from "jspdf";

const AddReport = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
  });

  const [generatedText, setGeneratedText] = useState("");
  const [oldPdfFile, setOldPdfFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setOldPdfFile(e.target.files[0]);
    }
  };

 
  const handleSubmit = () => {
    const { firstName, lastName, age } = formData;
    if (!firstName || !lastName || !age) {
      alert("Barcha maydonlarni to'ldiring!");
      return;
    }
    const text = `${firstName} ${lastName} bu o'quvchi Toshkent Kimyo Texnologiya Institutining SMM fakultetida o'qiydi va uni yoshi ${age} da.`;
    setGeneratedText(text);
  };

  const downloadPDF = async () => {
    const doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(14);
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleFontSize = 18;
    doc.setFontSize(titleFontSize);
    doc.setFont("times", "bold");
  
    const titleText = "HISOBOT";
    const titleWidth = doc.getTextWidth(titleText);
    const titleX = (pageWidth - titleWidth) / 2;
    const titleY = 20;
  
    doc.text(titleText, titleX, titleY);
  
    const textStartY = titleY + 10;
    doc.setFontSize(14);
    doc.setFont("times", "normal");
  
    const margin = 10;
    const textWidth = pageWidth - 2 * margin;
    const splitText = doc.splitTextToSize(generatedText, textWidth);
    doc.text(splitText, margin, textStartY);
  
    // Sana va vaqtni olish (YYYY-MM-DD_HH-MM-SS formatida)
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // "2025-02-16" formatida
    const hours = String(today.getHours()).padStart(2, "0"); // 09, 10, 11...
    const minutes = String(today.getMinutes()).padStart(2, "0"); // 01, 02...
    const seconds = String(today.getSeconds()).padStart(2, "0"); // 05, 10...
  
    // Foydalanuvchi ismi va vaqtni fayl nomiga qo‘shish
    const fileName = `${formData.firstName}_${formData.lastName}__Sana__${formattedDate}__Vaqti__${hours}-${minutes}-${seconds}.pdf`;
  
    const pdfBlob = new Blob([doc.output("blob")], { type: "application/pdf" });
  
    if (oldPdfFile) {
      await mergePDFs(pdfBlob, oldPdfFile, fileName);
    } else {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName; // Foydalanuvchi ismi + sana + vaqt formatida fayl nomi
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  
  const mergePDFs = async (newPdfBlob, oldPdfFile) => {
    const newPdf = await PDFDocument.load(await newPdfBlob.arrayBuffer());
    const oldPdfBytes = await oldPdfFile.arrayBuffer();
    const oldPdf = await PDFDocument.load(oldPdfBytes);

    const mergedPdf = await PDFDocument.create();

    const newPages = await mergedPdf.copyPages(newPdf, newPdf.getPageIndices());
    newPages.forEach((page) => mergedPdf.addPage(page));

    const oldPages = await mergedPdf.copyPages(oldPdf, oldPdf.getPageIndices());
    oldPages.forEach((page) => mergedPdf.addPage(page));

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Hisobot.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 min-h-screen text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">O'quvchi Ma'lumotlari</h2>
        <input
          type="text"
          name="firstName"
          placeholder="Ism"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Familiya"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
        />
        <input
          type="number"
          name="age"
          placeholder="Yosh"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600"
        >
          Create
        </button>
      </div>
      {generatedText && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg w-96">
          <p>{generatedText}</p>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="w-full bg-gray-700 p-2 rounded text-white mt-2"
          />
          <button
            onClick={downloadPDF}
            className="mt-2 w-full bg-green-500 p-2 rounded hover:bg-green-600"
          >
            PDF yuklab olish
          </button>
        </div>
      )}
    </div>  
  );
};

export default AddReport;
