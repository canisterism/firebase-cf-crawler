import puppeteer from "puppeteer";
import { GamePage } from "./game";

(async () => {
  try {
    console.log("start");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    const initialGame = {
      title: "p5",
      hardware: "ps4",
      wikiId: 6437,
      genre: undefined,
      publishedAt: undefined,
      publisher: undefined,
      imageUrl: undefined,
      price: undefined,
    };
    const gamePage = new GamePage({ page: page, game: initialGame });
    const game = await gamePage.fetchGameInfo();

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
