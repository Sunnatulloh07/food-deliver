import { storage } from "@/lib/firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { imageUrl } = req.body;

    if (!imageUrl || 
        (Array.isArray(imageUrl) && imageUrl.length === 0) || 
        (Array.isArray(imageUrl) && imageUrl.every(url => !url)) || 
        (typeof imageUrl === "string" && !imageUrl.trim())) {
      return res.status(400).json({ message: "Valid image URL is required" });
    }

    const urlsToDelete = Array.isArray(imageUrl) ? imageUrl : [imageUrl];

    for (const url of urlsToDelete) {
      if (!url.trim()) continue;

      const decodedUrl = decodeURIComponent(url);
      const baseUrl = "https://storage.googleapis.com/uz-dev-44892.appspot.com/";

      if (!decodedUrl.startsWith(baseUrl)) {
        return res.status(400).json({ message: "Invalid image URL" });
      }

      const filePath = decodedUrl.replace(baseUrl, "");
      await storage.file(filePath).delete();
    }

    return res.status(200).json({ message: "Image(s) deleted successfully" });
  } catch (error: unknown) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting image" });
  }
}
