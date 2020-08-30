import puppeteer from "puppeteer";
import { fetchGameInfo } from "./game";

(async () => {
  try {
    console.log("start");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    const initialGame = {
      title: "スーパーマリオワールド",
      hardware: "sfc",
      wikiId: 3502,
      genre: undefined,
      publishedAt: undefined,
      publisher: undefined,
      imageUrl: undefined,
      price: undefined,
    };
    const game = await fetchGameInfo(page, initialGame);

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
