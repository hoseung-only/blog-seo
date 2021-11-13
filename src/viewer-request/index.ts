import { CloudFrontRequest, CloudFrontRequestEvent } from "aws-lambda";

import { Headers } from "../helpers/Headers";

export async function handler(event: CloudFrontRequestEvent): Promise<CloudFrontRequest> {
  const request = event.Records[0].cf.request;
  const headers = new Headers(request.headers);

  const userAgent = headers.get("User-Agent");
  if (userAgent) {
    const headerName = "X-Viewer-User-Agent";
    request.headers[headerName.toLowerCase()] = [{ key: headerName, value: userAgent }];
  }

  return request;
}
