import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { storage } from "../../../lib/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false, // Form-data uchun bodyParser o‘chirilgan
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "File upload error" });
    }

    const uploadedFiles = files.file || files.images;
    if (!uploadedFiles) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
    const uploadResults = [];

    try {
      for (const file of fileArray) {
        const filePath = file.filepath;
        const newFileName = `${uuidv4()}-${file.originalFilename}`;
        const fileUpload = storage.file(`food-delivery/images/${newFileName}`);

        // Faylni Firebase Storage-ga yuklaymiz
        await fileUpload.save(fs.readFileSync(filePath), {
          metadata: { contentType: file.mimetype || "application/octet-stream" },
        });

        await fileUpload.makePublic(); // Faylni ochiq qilish

        const publicUrl = `https://storage.googleapis.com/${storage.name}/food-delivery/images/${newFileName}`;
        uploadResults.push({ url: publicUrl, public_id: newFileName });
      }

      // Agar 1 ta fayl bo‘lsa, obyekt qaytaramiz, ko‘p bo‘lsa array
      const response = uploadResults.length === 1 ? uploadResults[0] : uploadResults;

      return res.status(200).json(response);
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ error: "File upload to Firebase failed", details: error });
    }
  });
}
