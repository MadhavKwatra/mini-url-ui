export interface ShortUrl {
  _id: string;
  originalUrl: string;
  shortId: string;
  createdAt: string;
  createdBy: string;
}

export interface CreateUrlRequest {
  originalUrl: string;
  customAlias?: string;
}
