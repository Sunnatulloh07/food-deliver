export async function uploadToImaege(
    files: { image: string; file: File }[]
  ) {
    try {
      const formData = new FormData();

      for (const item of files) {
        formData.append("images", item?.file as Blob);
      }

      const response = await fetch("/api/file-upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const res = Array.isArray(data) ? data : [data];
      return res.map((item: { url: string }) => item.url);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  }