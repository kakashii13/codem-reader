import puppeteer from "puppeteer";
import { config } from "../utils/config";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getPdf = async (idPerson: string) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36",
      ],
    });
    const page = await browser.newPage();
    await page.goto(config.url);

    // Check if the input 'cuil/dni' is available
    await page.waitForSelector("#ContentPlaceHolder1_txtDoc");

    // Delay to avoid captcha
    await delay(2000);

    // Try to get the pdf
    try {
      // Fill the input 'cuil/dni'
      await page.type("#ContentPlaceHolder1_txtDoc", idPerson);

      // If is ok, click the button
      await page.click("#ContentPlaceHolder1_Button1");

      // If there are an error in the input, show the error

      await page.waitForSelector("#ContentPlaceHolder1_DGOOSS", {
        timeout: 2000,
      });

      // Downllad the pdf
      await page.click("a");
      // Configure the download path and allow the download
      const client = await page.target().createCDPSession();
      await client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: config.downloadPdfPath,
      });

      // Delay to download the pdf
      await delay(2000);

      // Close the browser
      await browser.close();

      return { pdfDownloaded: true, error: null };
    } catch (error) {
      // If there are an error in the input, show the error, evaluating the error message
      const err = await page.$eval(".errorMsg", (el) => el.textContent);
      // Close the browser
      await browser.close();
      // Return the error
      return { pdfDownloaded: false, error: err };
    }
  } catch (error: any) {
    console.error(error);
    // Return the error
    return { pdfDownloaded: false, error: error.message };
  }
};

export { getPdf };
