import {
  CloudFrontRequest,
  CloudFrontRequestEvent,
  CloudFrontResultResponse,
} from "aws-lambda";

import { Headers } from "../helpers/Headers";

const Regex = {
  UUID: /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/,
};

const defaultOgImage =
  "https://blog-media.hoseung.me/blog-og-main-profile-image.png";

export async function handler(
  event: CloudFrontRequestEvent
): Promise<CloudFrontRequest | CloudFrontResultResponse> {
  const request = event.Records[0].cf.request;
  const headers = new Headers(request.headers);

  const headerName = "X-Viewer-User-Agent";
  request.headers[headerName.toLowerCase()] = [
    { key: headerName, value: headers.get("User-Agent") },
  ];

  return request;
}
