import puppeteer from "puppeteer";
import { url } from "./utils/page";

interface Game {
  title: string;
  hardware: string;
  wikiId: number;
  genre?: string;
  publishedAt?: Date;
  publisher?: string;
  imageUrl?: string;
  price?: number;
}

///Error: Evaluation failed: ReferenceError: setGameInfo is not defined
///    at __puppeteer_evaluation_script__:3:29
///    at ExecutionContext._evaluateInternal (/Users/otanihiroki/dev/firebase-cf-crawler/node_modules/puppeteer/lib/cjs/puppeteer/common/ExecutionContext.js:217:19)
///    at process._tickCallback (internal/process/next_tick.js:68:7)
/// WTF!!

function setGameInfo({
  game,
  rows,
}: {
  game: Game;
  rows: HTMLTableRowElement[];
}): Game {
  const newGame = { ...game };
  rows.forEach((row) => {
    const title = row.cells[0].innerText;

    switch (title) {
      case "ジャンル":
        newGame.genre = row.cells[1].innerText;
        break;
      case "発売日":
        // yyyy年mm月dd日のフォーマット
        const dateArray = /(\d{4})年(\d{1,2})月(\d{1,2})日/.exec(
          row.cells[1].innerText
        );

        newGame.publishedAt = new Date(
          parseInt(dateArray![1]),
          parseInt(dateArray![2]),
          parseInt(dateArray![3])
        );
        break;
      case "発売":
        // 「発売」「発売・開発元」「発売元」のパターンが存在する
        // 「発売元」の方が「発売日」よりも前に来ることが前提になったcaseの順番
        newGame.publisher = row.cells[1].innerText;
        break;
      case "定価":
        // TODO(canisterism)「価格」のパターンもあるので対応？
        // xxx,xxx円
        const priceText = /(\d{1,3} *,\d{1,3})円/.exec(
          row.cells[1].innerText
        )![0];
        newGame.price = parseInt(priceText.replace(",", ""));
        break;
      default:
        break;
    }
  });

  return newGame;
}

export async function fetchGameInfo(
  page: puppeteer.Page,
  game: Game
): Promise<Game> {
  console.log("start fetch game....");
  await page.goto(url(game.wikiId));

  const newGame = await page.evaluate(() => {
    const rows = Array.from(
      document.querySelector("tbody")!.querySelectorAll("tr")
    );
    return setGameInfo({ game: game, rows: rows });
  });
  return newGame;
}
