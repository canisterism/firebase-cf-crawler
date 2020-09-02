import puppeteer from "puppeteer";
import { GamePage } from "./pages/gamePage";
import { hardwares, Hardware } from "./domain/models/hardware";
import { HardWarePage } from "./pages/hardwarePage";
import { registerGame } from "./application/usecases/registerGame";

(async () => {
  // try {
  //   console.log("start");
  //   const browser = await puppeteer.launch({
  //     headless: true,
  //     args: ["--no-sandbox"],
  //   });
  //   const page = await browser.newPage();
  //   hardwares.forEach(async (hardware: Hardware) => {
  //     console.log(`start fetching: ${hardware.name}`);
  //     const hardwarePage = new HardWarePage({
  //       page: page,
  //       hardware: hardware,
  //     });
  //     await hardwarePage.fetch();
  //     console.log(`fetched: ${hardware.name}`);
  //     hardwarePage.games.forEach(async (basicInfo) => {
  //       const gamePage = new GamePage({
  //         page: page,
  //         title: basicInfo.title,
  //         hardware: basicInfo.hardware,
  //         wikiId: basicInfo.wikiId,
  //       });
  //       console.log(`startfetching: ${hardware.name}`);
  //       const game = await gamePage.fetch();
  //       await registerGame(game);
  //     });
  //   });
  //   // const gamePage = new GamePage({
  //   //   page: page,
  //   //   title: "ペルソナ5",
  //   //   hardware: "ps4",
  //   //   wikiId: 6437,
  //   // });
  //   // const game = await gamePage.fetch();
  //   // console.log(game);
  //   browser.close();
  //   console.log("end");
  // } catch (error) {
  //   console.error(error);
  // }
})();
