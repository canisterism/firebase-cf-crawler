export interface GameDetails {
  genre?: string;
  publishedAt?: Date;
  publisher?: string;
  price?: number;
}

export class Game {
  title: string;
  hardware: string;
  wikiId: number;
  imageUrl?: string;
  genre: GameDetails["genre"];
  publishedAt: GameDetails["publishedAt"];
  publisher: GameDetails["publisher"];
  price: GameDetails["price"];

  constructor({
    title,
    hardware,
    wikiId,
    genre = undefined,
    publishedAt = undefined,
    publisher = undefined,
    imageUrl = undefined,
    price = undefined,
  }: {
    title: string;
    hardware: string;
    wikiId: number;
    genre?: string;
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
