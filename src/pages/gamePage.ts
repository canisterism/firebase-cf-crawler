import puppeteer from "puppeteer";
import { Game, GameDetails } from "../domain/models/game";
import { url } from "../utility/functions";

export class GamePage {
  private _page: puppeteer.Page;
  private _title: string;
  private _hardware: string;
  private _wikiId: number;
  private _genre: string;

  constructor({
    page,
    title,
    hardware,
    wikiId,
    genre,
  }: {
    page: puppeteer.Page;
    title: string;
    hardware: string;
    wikiId: number;
    genre: string;
  }) {
    this._page = page;
    this._title = title;
    this._hardware = hardware;
    this._wikiId = wikiId;
    this._genre = genre;
  }

  async fetch(): Promise<Game> {
    await this._page.goto(url(this._wikiId), {
      waitUntil: "domcontentloaded",
    });
    const imageUrl = await this.imageUrl();
    const details = this.formatTableRows(await this.fetchTableRows());
    return new Game({
      title: this._title,
      hardware: this._hardware,
      wikiId: this._wikiId,
      imageUrl: imageUrl,
      genre: this._genre,
      publishedAt: details.publishedAt,
      publisher: details.publisher,
      price: details.price,
    });
  }

  async imageUrl(): Promise<string | undefined> {
    try {
      const imageUrl = await this._page.$eval("#wikibody img", (img) => {
        return img.getAttribute("src");
      });
      return typeof imageUrl === "string" ? imageUrl : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  // ページの最初のtbody内のtrを全部取得してArray in Arrayにして取得する
  // 最低でも以下のようなデータが入っている
  // [
  //   ['ジャンル', 'アクション'],
  //   ['発売日', '2020年9月1日'],
  //   ['発売元', 'フロム・ソフトウェア'],
  //   ['定価', 'アクション'],
  // ]
  async fetchTableRows(): Promise<string[][]> {
    try {
      // $eval("tbody") で先頭のテーブルに限定して取得する
      return await this._page.$eval("#wikibody tbody", (tbody) => {
        return Array.from(tbody.querySelectorAll("tr")).map((row) => {
          return row.innerText.split("\t");
        });
      });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  formatTableRows(rows: string[][]): GameDetails {
    const details: GameDetails = {};
    rows.forEach((row: string[]) => {
      const [key, value] = [row[0], row[1]];
      console.log(`${key}: ${value}`);

      if (key.includes("発売日")) {
        details.publishedAt = this.formatStringToPublishedAt(value);
      } else if (key.includes("発売")) {
        // 「発売」「発売・開発元」「発売元」のパターンが存在する
        // 「発売元」の方が「発売日」よりも前に来ることが前提になった順番
        details.publisher = value.split("\n")[0];
      } else if (key.includes("定価") || key.includes("価格")) {
        details.price = this.formatStringToPrice(value);
      }
    });
    return details;
  }

  formatStringToPublishedAt(string: string): Date | undefined {
    try {
      // yyyy年mm月dd日のフォーマット
      const dateArray = /(\d{4})年(\d{1,2})月(\d{1,2})日/.exec(string);

      return new Date(
        parseInt(dateArray![1]),
        parseInt(dateArray![2]) - 1, // なぜか月が0indexなので1足しておく
        parseInt(dateArray![3])
      );
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  formatStringToPrice(string: string): number | undefined {
    try {
      // xxx,xxx円のフォーマット
      const priceText = /(\d{1,3} *,\d{1,3})円/.exec(string)![0];
      return parseInt(priceText.replace(",", ""));
    } catch (error) {
      console.error(error);
    }
  }
}
