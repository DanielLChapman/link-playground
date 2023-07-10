export type Session = {
    itemId: string;
    listKey: string;
    data: {
      username: string;
    };
  };
  
export type User = {
  id: string,
  username: string,
  password: string,
  email?: string,
  createdAt: Date,
}

export type ShortenedLink = {
  id: string,
  originalURL: string,
  shortenedURL: string,
  isPrivate: boolean,
  privatePass: string,
  owner: User,
  clicks: number,
  createdAt: Date,
}