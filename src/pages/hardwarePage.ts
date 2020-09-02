import puppeteer from "puppeteer";
import { Hardware } from "../domain/models/hardware";
import { GameBasicInfo } from "../domain/models/game";

export class HardWarePage {
  page: puppeteer.Page;
  hardware: Hardware;
  _games: GameBasicInfo[] = [];

  constructor({
    page,
    hardware,
  }: {
    page: puppeteer.Page;
    hardware: Hardware;
  }) {
    this.page = page;
    this.hardware = hardware;
  }

  async fetch(): Promise<void> {
    return;
  }

  get games() {
    return this._games;
  }
}
