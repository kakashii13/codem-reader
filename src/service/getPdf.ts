import fs from "fs";
import puppeteer from "puppeteer";
import { config } from "../utils/config";
import { parsePdf } from "./extractTextFromPdf";
import { parseData } from "./parsedData";

// Function to delay the execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Initialize the browser and go to the Codem page
// The function return the browser and the page
const initializateBrowser = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36",
      ],
    });

    // Open a new page
    const page = await browser.newPage();
    // Go to the Codem page
    await page.goto(config.url);

    return {
      browser,
      page,
    };
  } catch (error) {
    console.error(error);
  }
};

const getPdfFromCodem = async (page: any, idPerson: string, browser: any) => {
  // Try to get the pdf
  try {
    await delay(2000);
    // Check if the input 'cuil/dni' is available
    await page.waitForSelector("#ContentPlaceHolder1_txtDoc");
    // Fill the input 'cuil/dni'
    await page.type("#ContentPlaceHolder1_txtDoc", idPerson);

    // If is ok, click the button
    await page.click("#ContentPlaceHolder1_Button1");

    // If there are an error in the input, show the error
    await page.waitForSelector("#ContentPlaceHolder1_DGOOSS", {
      timeout: 2000,
    });

    // Download the pdf
    await page.click("table#ContentPlaceHolder1_DGOOSS a:first-child");
    // Configure the download path and allow the download
    const client = await page.target().createCDPSession();
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: config.downloadPdfPath,
    });

    // Delay to download the pdf
    await delay(2000);

    // Go back to the previous page
    await page.waitForSelector("#ContentPlaceHolder1_tdBotones");
    await page.click("input[value='Volver']");

    return { pdfDownloaded: true, error: null };
  } catch (error: any) {
    console.error(error);
    return { pdfDownloaded: false, error: error.message };
  }
};

// Function to get the pdf from Codem
const getPdf = async (idsPersons: string[]) => {
  const resultPdfs = [];
  // Initialize the browser
  const { page, browser }: any = await initializateBrowser();
  try {
    // Check if the input 'cuil/dni' is available
    await page.waitForSelector("#ContentPlaceHolder1_txtDoc");

    // Delay to avoid captcha
    await delay(2000);

    // Iterate over the idsPersons
    for (const idPerson of idsPersons) {
      try {
        // Get the pdf from Codem
        const pdfResult: any = await getPdfFromCodem(page, idPerson, browser);

        if (pdfResult.pdfDownloaded) {
          // Read the pdf generated from Codem
          const pdf = fs.readFileSync(config.searchPdfPath);
          // Extract text from pdf
          const data = await parsePdf(pdf);
          // Convert the extracted text to an object
          const textParsed = parseData(data.text);

          resultPdfs.push(textParsed);
        } else {
          resultPdfs.push({
            cuil: idPerson,
            error: "Error al buscar el DNI/CUIL",
          });
        }
      } catch (error) {
        resultPdfs.push({
          cuil: idPerson,
          error: "Error al buscar el DNI/CUIL",
        });
      }
    }

    // Close the browser
    await browser.close();
    return { pdfDownloaded: true, error: null, data: resultPdfs };
  } catch (error) {
    // If there are an error in the input, show the error, evaluating the error message
    const err = await page.$eval(".errorMsg", (el: any) => el.textContent);
    // Close the browser
    await browser.close();
    // Return the error
    return { pdfDownloaded: false, error: err };
  }
};

export { getPdf };
