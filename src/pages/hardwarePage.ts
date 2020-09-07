import puppeteer from "puppeteer";
import { Hardware } from "../domain/models/hardware";
import { GameBasicInfo } from "../domain/models/game";
import { assert, url, extractPageId } from "../utility/functions";

export class HardWarePage {
  _page: puppeteer.Page;
  hardware: Hardware;

  constructor({
    page,
    hardware,
  }: {
    page: puppeteer.Page;
    hardware: Hardware;
  }) {
    this._page = page;
    this.hardware = hardware;
  }

  async fetchGames(): Promise<GameBasicInfo[]> {
    await this._page.goto(url(this.hardware.wikiId), {
      waitUntil: "domcontentloaded",
    });
    console.log(`fetched ${url(this.hardware.wikiId)}.`);

    // 全部tr取ってくる
    const games = await this._page.$$eval("tr", (rows) => {
      const games: GameBasicInfo[] = Array.from(rows)
        .filter((row) => {
          // リンクがないrowは見出しなのでスキップする
          return row.querySelector("a") !== null;
        })
        .map((row) => {
          const link = row.querySelector("a");
          const genre =
            link?.parentElement?.nextElementSibling?.textContent?.trim() ||
            "etc";
          return <GameBasicInfo>{
            title: link!.text,
            hardware: "", // TODO(canisterism): どうやってもthis.hardware.nameが取れないので方法を見つける
            wikiId: parseInt(
              new RegExp(/pages\/(\d+)\.html/).exec(link!.href)![1]
            ),
            // TODO(canisterism): ホントはこう書きたいけどブラウザの世界にfunctionを持ってけない
            // wikiId: extractPageId(link!.href),
            genre: genre, // 'ACT'など
          };
        });
      return games;
    });
    // TODO(canisterism): キモいので直したい ゴミコードを書くな
    return this.addHardwareName(games);
  }

  addHardwareName(games: GameBasicInfo[]): GameBasicInfo[] {
    return games.map((game) => {
      game.hardware = this.hardware.name;
      return game;
    });
  }
}
