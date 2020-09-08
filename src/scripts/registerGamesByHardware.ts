import puppeteer from "puppeteer";
import { hardwares } from "../domain/models/hardware";
import { HardWarePage } from "../pages/hardwarePage";
import { GamePage } from "../pages/gamePage";
import { registerGame } from "../application/usecases/registerGame";
import { assert } from "../utility/functions";
import * as fs from "fs";
import { Game } from "../domain/models/game";

(async () => {
  try {
    console.log("start");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    const name = "PlayStation2";

    const hardware = hardwares.find((hardware) => {
      return hardware.name === name;
    });

    assert(hardware);

    console.log(`start fetching: ${hardware.name}`);

    const hardwarePage = new HardWarePage({
      page: page,
      hardware: hardware,
    });
    const gamesBasicInfo = await hardwarePage.fetchGames();

    console.log(`fetched: ${hardware.name}`);
    console.log(gamesBasicInfo);

    const games: Game[] = [];
    // Promise.allしたいけど短時間にアクセスさせたくないのでfor inで処理する(mapでもいいかも？)
    for (const basicInfo of gamesBasicInfo) {
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
      games.push(game);
    }

    fs.writeFile(
      `${hardware.name}.json`,
      JSON.stringify(games, null, "    "),
      (err) => {
        console.error(err);
      }
    );
    console.log(games);
    browser.close();
    console.log("end");
  } catch (error) {
    console.error(error);
  }
})();
