export interface GameBasicInfo {
  title: string;
  hardware: string;
  wikiId: number;
  genre: string;
}
export interface GameDetails {
  publishedAt?: Date;
  publisher?: string;
  price?: number;
}

export class Game {
  title: GameBasicInfo["title"];
  hardware: GameBasicInfo["hardware"];
  wikiId: GameBasicInfo["wikiId"];
  genre: GameBasicInfo["genre"];
  imageUrl?: string;
  publishedAt: GameDetails["publishedAt"];
  publisher: GameDetails["publisher"];
  price: GameDetails["price"];

  constructor({
    title,
    hardware,
    wikiId,
    genre,
    publishedAt = undefined,
    publisher = undefined,
    imageUrl = undefined,
    price = undefined,
  }: {
    title: string;
    hardware: string;
    wikiId: number;
    genre: string;
    publishedAt?: Date;
    publisher?: string;
    imageUrl?: string;
    price?: number;
  }) {
    this.title = title;
    this.hardware = hardware;
    this.wikiId = wikiId;
    this.genre = genre;
    this.publishedAt = publishedAt;
    this.publisher = publisher;
    this.imageUrl = imageUrl;
    this.price = price;
  }
}
