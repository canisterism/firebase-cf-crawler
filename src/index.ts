import puppeteer from "puppeteer";
import { HardWarePage } from "./pages/hardwarePage";
import { hardwares } from "./domain/models/hardware";

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  try {
    console.log("start");

    const page = await browser.newPage();

    const hardwarePage = new HardWarePage({
      page: page,
      hardware: hardwares[10],
    });
    const games = await hardwarePage.fetchGames();
    console.log(games);

    browser.close();
    console.log("end");
  } catch (error) {
    console.error(error);
  } finally {
    browser.close();
  }
})();
