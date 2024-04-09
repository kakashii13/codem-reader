import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  url: process.env.URL_CODEM || "http://localhost",
  downloadPdfPath: process.env.DOWNLOAD_PDF_PATH || "./pdf",
  searchPdfPath: process.env.SEARCH_PDF_PATH || "./pdf",
};
