import pdfParse from "pdf-parse";

// Function to extract text from pdf
const parsePdf = async (pdfBuffer: Buffer | undefined) => {
  try {
    if (pdfBuffer === undefined) {
      throw new Error("The pdf is empty");
    }
    const data = await pdfParse(pdfBuffer);
    return data;
  } catch (error) {
    throw error;
  }
};
export { parsePdf };
