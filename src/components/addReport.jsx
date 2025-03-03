import { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import jsPDF from "jspdf";
import '../styles/AddReport.css'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddReport = () => {
  // Birinchi forma uchun state
  const [report1, setReport1] = useState({
    title: '',
    date: '',
    file: null
  });

  // Ikkinchi forma uchun state
  const [report2, setReport2] = useState({
    title: '',
    date: '',
    file: null
  });

  // Uchinchi forma uchun state
  const [report3, setReport3] = useState({
    title: '',
    date: '',
    file: null
  });

  // To'rtinchi forma uchun state
  const [report4, setReport4] = useState({
    title: '',
    date: '',
    file: null
  });

  // Beshinchi forma uchun state
  const [report5, setReport5] = useState({
    title: '',
    date: '',
    file: null
  });

  const [isGoogleReady, setIsGoogleReady] = useState(false);

  useEffect(() => {
    const loadGoogleAPI = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = initGoogleClient;
    };

    loadGoogleAPI();
  }, []);

  const initGoogleClient = async () => {
    try {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: '',
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: () => {
          setIsGoogleReady(true);
        },
      });

      if (!tokenClient) {
        throw new Error('Token client initialization failed');
      }

      setIsGoogleReady(true);
    } catch (error) {
      console.error('Google API initialization error:', error);
      alert('Google API ni yuklashda xatolik yuz berdi');
    }
  };

  const uploadToDrive = async (pdfBlob, fileName) => {
    try {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: '',
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: async (response) => {
          if (response.error) {
            throw response;
          }

          const accessToken = response.access_token;
          const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
          
          const metadata = {
            name: fileName,
            mimeType: 'application/pdf',
            parents: ['']
          };

          const form = new FormData();
          form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
          form.append('file', file);

          const uploadResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: form,
          });

          if (!uploadResponse.ok) {
            throw new Error('Google Drivega yuklashda xatolik');
          }

          const result = await uploadResponse.json();
          console.log('File uploaded successfully:', result);
          
          // Muvaffaqiyatli yuklangandan keyin toast chiqarish
          toast.success('Fayl Google Drivega muvaffaqiyatli yuklandi!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
              background: '#4ade80',
              color: '#fff'
            }
          });
        },
      });

      tokenClient.requestAccessToken();
    } catch (error) {
      console.error('Upload error:', error);
      // Xatolik yuz berganda toast chiqarish
      toast.error('Faylni Google Drivega yuklashda xatolik yuz berdi!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#ef4444',
          color: '#fff'
        }
      });
    }
  };

  const generateAndUploadPDF = async () => {
    try {
      // Asosiy PDF yaratish
      const doc = new jsPDF();
      doc.setFont("times", "normal");
      doc.setFontSize(14);

      // Sarlavha
      doc.setFontSize(18);
      doc.setFont("times", "bold");
      doc.text("HISOBOT", 105, 20, { align: "center" });
      
      let yPosition = 40;

      // Har bir reportni PDF ga qo'shish
      const reports = [report1, report2, report3, report4, report5];
      const reportTitles = [
        "Konferensiyalar",
        "Maqolalar",
        "Stajirovkalar",
        "Seminar va Vebinarlar",
        "Patent va Foydali Modellar"
      ];
      
      for (let i = 0; i < reports.length; i++) {
        const report = reports[i];
        if (report.title || report.date || report.file) {
          doc.setFontSize(14);
          doc.setFont("times", "bold");
          doc.text(reportTitles[i], 20, yPosition);
          yPosition += 10;

          doc.setFont("times", "normal");
          if (report.title) {
            doc.text(`Nomi: ${report.title}`, 20, yPosition);
            yPosition += 10;
          }
          if (report.date) {
            doc.text(`Sana: ${report.date}`, 20, yPosition);
            yPosition += 10;
          }
          yPosition += 10; // Qo'shimcha bo'sh joy
        }
      }

      // Asosiy PDF ni blob ga o'zgartirish
      const mainPdfBlob = new Blob([doc.output("blob")], { type: "application/pdf" });

      // Barcha PDF fayllarni birlashtirish
      const mergedPdf = await PDFDocument.create();
      
      // Asosiy PDF ni qo'shish
      const mainPdfBytes = await mainPdfBlob.arrayBuffer();
      const mainPdfDoc = await PDFDocument.load(mainPdfBytes);
      const mainPages = await mergedPdf.copyPages(mainPdfDoc, mainPdfDoc.getPageIndices());
      mainPages.forEach((page) => mergedPdf.addPage(page));

      // Yuklangan PDF fayllarni qo'shish
      for (const report of reports) {
        if (report.file) {
          const fileBytes = await report.file.arrayBuffer();
          const pdf = await PDFDocument.load(fileBytes);
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          pages.forEach((page) => mergedPdf.addPage(page));
        }
      }

      // Yakuniy PDF ni yaratish
      const mergedPdfBytes = await mergedPdf.save();
      const mergedPdfBlob = new Blob([mergedPdfBytes], { type: "application/pdf" });

      // Fayl nomini yaratish
      const today = new Date();
      const fileName = `Hisobot_${today.toISOString().split('T')[0]}.pdf`;

      // Google Drive ga yuklash
      await uploadToDrive(mergedPdfBlob, fileName);

      // Mahalliy yuklab olish uchun
      const url = URL.createObjectURL(mergedPdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("PDF yaratishda xatolik:", error);
      alert("PDF yaratishda xatolik yuz berdi");
    }
  };

  return (
    <div className="p-4 transition-all duration-300">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="max-w-[1100px] mx-auto space-y-6">
        {/* Birinchi forma */}
        <div className="bg-blue-500 shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Conferensiya</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-00 mb-1">
                Conferensiya nomi
              </label>
              <input
                type="text"
                value={report1.title}
                onChange={(e) => setReport1({...report1, title: e.target.value})}
                className="m-w-[1000px] px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Conferensiya nomini kiriting"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sana
              </label>
              <input
                type="date"
                value={report1.date}
                onChange={(e) => setReport1({...report1, date: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fayl yuklash
              </label>
              <input
                type="file"
                onChange={(e) => setReport1({...report1, file: e.target.files[0]})}
                className="w-full"
                accept=".pdf,.doc,.docx"
              />
            </div>
          </div>
        </div>

        {/* Ikkinchi forma */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Maqolalar</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maqolalar nomi
              </label>
              <input
                type="text"
                value={report2.title}
                onChange={(e) => setReport2({...report2, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Maqola nomini kiriting"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sana
              </label>
              <input
                type="date"
                value={report2.date}
                onChange={(e) => setReport2({...report2, date: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fayl yuklash
              </label>
              <input
                type="file"
                onChange={(e) => setReport2({...report2, file: e.target.files[0]})}
                className="w-full"
                accept=".pdf,.doc,.docx"
              />
            </div>
          </div>
        </div>

        {/* Uchinchi forma */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Stajirofkalar</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stajirofkalar
              </label>
              <input
                type="text"
                value={report3.title}
                onChange={(e) => setReport3({...report3, title: e.target.value})}
                className="m-w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Stajirofkalar nomini kiriting"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sana
              </label>
              <input
                type="date"
                value={report3.date}
                onChange={(e) => setReport3({...report3, date: e.target.value})}
                className="m-w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fayl yuklash
              </label>
              <input
                type="file"
                onChange={(e) => setReport3({...report3, file: e.target.files[0]})}
                className="m-w-full"
                accept=".pdf,.doc,.docx"
              />
            </div>
          </div>
        </div>

        {/* To'rtinchi forma */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Seminar,Webinar</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conferensiya nomi
              </label>
              <input
                type="text"
                value={report4.title}
                onChange={(e) => setReport4({...report4, title: e.target.value})}
                className="m-w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Seminar,Webinar nomini kiriting"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sana
              </label>
              <input
                type="date"
                value={report4.date}
                onChange={(e) => setReport4({...report4, date: e.target.value})}
                className="m-w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fayl yuklash
              </label>
              <input
                type="file"
                onChange={(e) => setReport4({...report4, file: e.target.files[0]})}
                className="m-w-full"
                accept=".pdf,.doc,.docx"
              />
            </div>
          </div>
        </div>

        {/* Beshinchi forma */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Patentlar,Foydali moddalar</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conferensiya nomi
              </label>
              <input
                type="text"
                value={report5.title}
                onChange={(e) => setReport5({...report5, title: e.target.value})}
                className="m-w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Patentlar,Foydali moddalar nomini kiriting"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sana
              </label>
              <input
                type="date"
                value={report5.date}
                onChange={(e) => setReport5({...report5, date: e.target.value})}
                className="m-w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fayl yuklash
              </label>
              <input
                type="file"
                onChange={(e) => setReport5({...report5, file: e.target.files[0]})}
                className="m-w-full"
                accept=".pdf,.doc,.docx"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={generateAndUploadPDF}
            className="bg-green-300 text-black py-2 px-6 rounded-md hover:bg-green-700"
          >
            PDF yaratish va Drive ga yuklash
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReport;
