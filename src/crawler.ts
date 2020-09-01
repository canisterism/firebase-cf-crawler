import puppeteer from "puppeteer";
import { GamePage } from "./pages/gamePage";

(async () => {
  try {
    console.log("start");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    const gamePage = new GamePage({
      page: page,
      title: "ペルソナ5",
      hardware: "ps4",
      wikiId: 6437,
    });
    const game = await gamePage.fetch();

    // hardwares.map(async (hardware: Hardware) => {
    //   await page.goto(url(hardware.id));
    //   console.log(`${hardware.id}:${hardware.name}`);
    // });
    console.log(game);
    browser.close();
    console.log("end");
  } catch (error) {
    console.error(error);
  }
})();
