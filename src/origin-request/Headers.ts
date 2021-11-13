import { CloudFrontHeaders } from "aws-lambda";

export class Headers {
  private map = new Map<string, string>();

  constructor(headers: CloudFrontHeaders) {
    for (const key in headers) {
      const value = headers[key][0]?.value;
      if (value) {
        this.map.set(key, value);
      }
    }
  }

  public get(key: string): string | null {
    return this.map.get(key) ?? null;
  }
}
