import puppeteer from "puppeteer";
import { Hardware, hardwares } from "../domain/models/hardware";
import { HardWarePage } from "../pages/hardwarePage";
import { GamePage } from "../pages/gamePage";
import { registerGame } from "../application/usecases/registerGame";
import { assert } from "../utility/functions";

(async () => {
  try {
    console.log("start");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    const name = "ファミリーコンピューター";

    const hardware = hardwares.find((hardware) => {
      return hardware.name === name;
    });

    assert(hardware);

    console.log(`start fetching: ${hardware.name}`);

    const hardwarePage = new HardWarePage({
      page: page,
      hardware: hardware,
    });
    const games = await hardwarePage.fetchGames();

    console.log(`fetched: ${hardware.name}`);

    games.forEach(async (basicInfo) => {
      const gamePage = new GamePage({
        page: page,
        title: basicInfo.title,
        hardware: basicInfo.hardware,
        wikiId: basicInfo.wikiId,
        genre: basicInfo.genre,
      });

      console.log(`start fetching: ${basicInfo.title}`);

      const game = await gamePage.fetch();
      console.log(`fetched: ${game.title}`);

      await registerGame(game);
    });

    browser.close();
    console.log("end");
  } catch (error) {
    console.error(error);
  }
})();
