import { CloudFrontRequest, CloudFrontRequestEvent, CloudFrontResultResponse } from "aws-lambda";

import { Headers } from "../helpers/Headers";

export async function handler(event: CloudFrontRequestEvent): Promise<CloudFrontRequest | CloudFrontResultResponse> {
  const request = event.Records[0].cf.request;
  const headers = new Headers(request.headers);

  const type = !!headers.get("user-agent")?.match(/facebookexternalhit|twitterbot|slackbot/g) ? "bot" : "user";
  const headerName = "X-Viewer-Type";
  request.headers[headerName.toLowerCase()] = [{ key: headerName, value: type }];

  return request;
}
