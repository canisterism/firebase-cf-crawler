export function assert(value: unknown): asserts value {
  if (value === undefined) {
    throw new Error("new Error(`cannot find a hardware");
  }
}
export function url(id: number): string {
  return `https://w.atwiki.jp/gcmatome/pages/${id}.html`;
}

export function extractPageId(url: string): number {
  return parseInt(new RegExp(/pages\/(\d+)\.html/).exec(url)![1]);
}
export function convertUndefinedToNull(k: string, v: any) {
  return v === undefined ? null : v;
}
