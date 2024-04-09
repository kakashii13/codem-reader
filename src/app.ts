import fs from "fs";

// Load environment variables
import { config } from "./utils/config";

// Express server
import express, { Request, Response } from "express";
// Express server
const app = express();

// Imports of the functions to get the pdf and extract text from it
import { getPdf } from "./service/getPdf";
import { parsePdf } from "./service/extractTextFromPdf";
import { parseData } from "./service/parsedData";

// Route to get the pdf file
app.get("/api/codem/:idPerson", async (req: Request, res: Response) => {
  try {
    // Get the idPerson from the query
    const idPerson = req.params.idPerson as string;
    // Get pdf from Codem
    const pdfResult: any = await getPdf(idPerson);

    if (pdfResult.pdfDownloaded) {
      // Read the pdf generated from Codem
      const pdf = fs.readFileSync(config.searchPdfPath);
      // Extract text from pdf
      const data = await parsePdf(pdf);
      // Convert the extracted text to an object
      const textParsed = parseData(data.text);

      console.log(textParsed);

      res.send({
        status: 200,
        message: "Search completed successfully",
        data: textParsed,
      });
    } else {
      res.send({
        status: 500,
        message: "An error occurred",
        data: pdfResult,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

export { app };
