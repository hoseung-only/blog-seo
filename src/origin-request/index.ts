import { CloudFrontRequest, CloudFrontRequestEvent, CloudFrontResultResponse } from "aws-lambda";

import { Client } from "@hoseung-only/blog-api-client";

import { Headers } from "../helpers/Headers";
import { Response } from "./Response";

const Regex = {
  UUID: /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/,
};

const defaultOgImage = "https://blog-media.hoseung.me/blog-og-main-profile-image.png";

export async function handler(event: CloudFrontRequestEvent): Promise<CloudFrontRequest | CloudFrontResultResponse> {
  const request = event.Records[0].cf.request;
  const headers = new Headers(request.headers);

  const viewerType = headers.get("x-viewer-type");
  if (!viewerType || viewerType !== "bot") {
    return request;
  }

  const client = new Client({
    baseURL: "https://y7wgfma059.execute-api.ap-northeast-2.amazonaws.com/prod",
  });

  const requestURL = `https://blog.hoseung.me${request.uri}`;

  if (request.uri === "/categories") {
    return Response.render({
      title: "장호승 개발 블로그 - 카테고리",
      description: "전체 카테고리 목록",
      image: "https://blog-media.hoseung.me/blog-og-main-profile-image.png",
      url: requestURL,
    });
  }

  const categoryShowMatch = request.uri.match(new RegExp(`^\/categories\/(${Regex.UUID.source})\/posts\/?$`));
  if (categoryShowMatch) {
    const categoryId = categoryShowMatch[1];
    const category = await client.getCategory({ id: categoryId });

    return Response.render({
      title: category.name,
      description: `${category.name} 카테고리 글 목록`,
      image: "https://blog-media.hoseung.me/blog-og-main-profile-image.png",
      url: requestURL,
    });
  }

  const postShowMatch = request.uri.match(new RegExp(`^\/posts\/(${Regex.UUID.source})\/?$`));
  if (postShowMatch) {
    const postId = postShowMatch[1];
    const post = await client.getPost({ id: postId });

    return Response.render({
      title: post.title,
      description: post.summary,
      image: post.coverImageURL || defaultOgImage,
      url: requestURL,
    });
  }

  // default
  return Response.render({
    title: "장호승 개발 블로그",
    description: "",
    image: defaultOgImage,
    url: requestURL,
  });
}
