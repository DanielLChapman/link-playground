

export type shortenedLinks = {
    id: string,
    originalURL: string,
    shortenedURL: string,
    owner: user,
    clicks: number,
    createdAt?: Date,
}



export type user = {
    id: string,
    username: string,
    links: shortenedLinks[],
    createdAt?: Date
    email: string,
}