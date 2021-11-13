import { CloudFrontResultResponse } from "aws-lambda";

export class Response {
  public static render(meta: {
    title: string;
    description: string;
    image: string;
    url: string;
  }): CloudFrontResultResponse {
    const body = `
    <html>
      <head>
        <meta charset="utf-8">
        <title>${meta.title}</title>
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="${meta.title}" />
        <meta property="og:description" content="${meta.description}" />
        <meta property="og:image" content="${meta.image}" />
        <meta property="og:url" content="${meta.url}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${meta.title}" />
        <meta name="twitter:description" content="${meta.description}" />
        <meta name="twitter:image" content="${meta.image}" />
      </head>
      <body></body>
    </html>
    `;

    return {
      status: "200",
      body,
      headers: {
        "Content-Type": [
          {
            key: "Content-Type",
            value: "text/html",
          },
        ],
      },
    };
  }
}
