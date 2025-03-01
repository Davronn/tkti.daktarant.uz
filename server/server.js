const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

const KEYFILEPATH = path.join(__dirname, "service-account.json"); // JSON fayl
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

app.use(require("cors")()); // Frontend bilan bog‘lash uchun CORS yoqiladi

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileMetadata = {
      name: req.file.originalname,
      parents: ["1ENqoq7eImx0tvyVFmaNLIwLu-aC9UUOD?q=sharedwith:public%20parent:1ENqoq7eImx0tvyVFmaNLIwLu-aC9UUOD%20sharedwith:CgJtZSgH"], // Papka ID
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    fs.unlinkSync(req.file.path); // Yuklangan faylni o‘chirish
    res.status(200).json({ fileId: file.data.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Xatolik yuz berdi!" });
  }
});

app.listen(5000, () => console.log("✅ Server 5000-portda ishlayapti"));
