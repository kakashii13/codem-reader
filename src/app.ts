// Express server
import express, { NextFunction, Request, Response } from "express";
// Express server
const app = express();

import papaparse from "papaparse";

import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Imports of the functions to get the pdf and extract text from it
import { getPdf } from "./service/getPdf";
import { errorManagerMiddleware } from "./middleware/errorManager.middleware";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const parseFile = (file: any) => {
  let csvData: any = [];
  if (!file.buffer.length) throw new Error("File empty.");
  papaparse.parse(file.buffer.toString(), {
    header: false,
    skipEmptyLines: true,
    complete: (results: any) => {
      csvData = results.data;
    },
  });

  return csvData.flat();
};

// Route to get the pdf file
app.post(
  "/api/codem",
  upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) throw new Error("There isn't a file.");

      const fileParsed = parseFile(req.file);

      if (!fileParsed.length) throw new Error("File is empty.");
      console.log("Cuantos deberia buscar: ", fileParsed?.length);

      // Get the data of pdfs from Codem
      // The data is an array of objects with the extracted text from the pdf
      const { data }: any = await getPdf(fileParsed);

      console.log("Cuantos busco: ", data.length);
      if (!data?.length) throw new Error("No data to found.");

      res.send({
        status: 200,
        message: "Search completed successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
);

app.use(errorManagerMiddleware);

export { app };
