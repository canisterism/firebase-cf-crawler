import puppeteer from "puppeteer";
import { url } from "./utils/page";

type GameBasicInfo = {
  title: string;
  hardware: string;
  wikiId: number;
};
type GameDetailInfo = {
  genre?: string;
  publishedAt?: Date;
  publisher?: string;
  imageUrl?: string;
  price?: number;
};
type Game = GameBasicInfo & GameDetailInfo;

export class GamePage {
  page: puppeteer.Page;
  game: Game;

  constructor({ page, game }: { page: puppeteer.Page; game: Game }) {
    this.page = page;
    this.game = game;
  }

  async fetchGameInfo(): Promise<Game> {
    console.log("start fetch game");
    await this.go();
    console.log("arrived at the page");
    // $eval("tbody") で先頭のテーブルに限定して取得する
    const rows: string[][] = await this.page.$eval("tbody", (tbody) => {
      return Array.from(tbody.querySelectorAll("tr")).map((row) => {
        return row.innerText.split("\t");
      });
    });
    rows.forEach((row) => {
      this.setGameInfo({ row: row });
    });
    return this.game;
  }

  async go(): Promise<puppeteer.Response | null> {
    return await this.page.goto(url(this.game.wikiId), {
      waitUntil: "domcontentloaded",
    });
  }

  setGameInfo({ row }: { row: string[] }): void {
    const key = row[0];
    const value = row[1];
    console.log(`${key}: ${value}`);

    if (key.includes("ジャンル")) {
      this.game.genre = value.split("\n")[0];
    } else if (key.includes("発売日")) {
      // yyyy年mm月dd日のフォーマット
      const dateArray = /(\d{4})年(\d{1,2})月(\d{1,2})日/.exec(value);
      console.log(dateArray);
      const utc = new Date(
        parseInt(dateArray![1]),
        parseInt(dateArray![2]) - 1,
        parseInt(dateArray![3])
      );
      // 雑にjst向けに1日戻す
      this.game.publishedAt = new Date(utc.setDate(utc.getDate() + 1));
      // 「発売」「発売・開発元」「発売元」のパターンが存在する
      // 「発売元」の方が「発売日」よりも前に来ることが前提になった順番
    } else if (key.includes("発売")) {
      this.game.publisher = value.split("\n")[0];
    } else if (key.includes("定価") || key.includes("価格")) {
      // TODO(canisterism)「価格」のパターンもあるので対応？
      // xxx,xxx円
      const priceText = /(\d{1,3} *,\d{1,3})円/.exec(value)![0];
      this.game.price = parseInt(priceText.replace(",", ""));
    }
  }
}
