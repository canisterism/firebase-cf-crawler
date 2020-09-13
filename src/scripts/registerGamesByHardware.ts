import puppeteer from "puppeteer";
import { hardwares } from "../domain/models/hardware";
import { HardWarePage } from "../pages/hardwarePage";
import { GamePage } from "../pages/gamePage";
import { registerGame } from "../application/usecases/registerGame";
import { assert, convertUndefinedToNull } from "../utility/functions";
import * as fs from "fs";
import { Game } from "../domain/models/game";

(async () => {
  try {
    console.log("start");

    for (const hardware of hardwares) {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });
      const page = await browser.newPage();
      console.log(`start fetching: ${hardware.name}`);

      const hardwarePage = new HardWarePage({
        page: page,
        hardware: hardware,
      });
      const gamesBasicInfo = await hardwarePage.fetchGames();

      console.log(`fetched: ${hardware.name}`);
      console.log(gamesBasicInfo);

      const chunk = 50; // 50件ずつjsonにする

      for (
        var index = 0, length = gamesBasicInfo.length;
        index < length;
        index += chunk
      ) {
        const games: Game[] = [];
        // Promise.allしたいけど短時間にアクセスさせたくないのでfor inで処理する
        for (const basicInfo of gamesBasicInfo.splice(0, chunk)) {
          const gamePage = new GamePage({
            page: page,
            title: basicInfo.title,
            hardware: basicInfo.hardware,
            wikiId: basicInfo.wikiId,
            genre: basicInfo.genre,
          });

          console.log(`fetching: ${basicInfo.title}`);
          try {
            const game = await gamePage.fetch();
            console.log(`fetched: ${game.title}`);
            games.push(game);
          } catch (error) {
            console.error(error);
          }
        }

        fs.writeFile(
          __dirname +
            `/../../tmp/${hardware.name}_${index}-${index + chunk}.json`,
          JSON.stringify(games, convertUndefinedToNull, "    "),
          (err) => {
            console.error(err);
          }
        );
      }
      browser.close();
    }

    console.log("end");
  } catch (error) {
    console.error(error);
  }
})();
