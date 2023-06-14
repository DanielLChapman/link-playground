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
}