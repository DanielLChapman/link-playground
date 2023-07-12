import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";

import {
    text,
    relationship,
    password,
    timestamp,
    select,
    integer,
    checkbox,
} from "@keystone-6/core/fields";

import { mergeSchemas } from "@graphql-tools/schema";
import type { GraphQLSchema } from "graphql";
import { User } from "./types";
import generateShortenedURL from "./mutations/generateShortenedURL";
import getURL from "./queries/getURL";

export const lists = {
    User: list({
        access: allowAll,
        fields: {
            username: text({
                validation: { isRequired: true },
                isIndexed: "unique",
            }),
            password: password({ validation: { isRequired: true } }),
            email: text({
                hooks: {
                    //@ts-ignore
                    validateInput: async ({
                        resolvedData,
                        item,
                        context,
                        addValidationError,
                    }) => {
                        //@ts-ignore

                        const { email } = resolvedData;

                        if (!email) {
                            return true;
                        } else {
                            const existingUser: User[] =
                                (await context.db.User.findMany({
                                    where: { email: { equals: email } },
                                })) as unknown as User[];

                            if (
                                existingUser &&
                                existingUser.length > 0 &&
                                existingUser[0].id !== item?.id
                            ) {
                                addValidationError("Invalid Email Entry");
                            }
                        }
                    },
                },
            }),
            links: relationship({
                ref: "ShortenedLink.owner",
                many: true,
            }),
            createdAt: timestamp({
                // this sets the timestamp to Date.now() when the user is first created
                defaultValue: { kind: "now" },
            }),
        },
    }),
    ShortenedLink: list({
        access: allowAll,
        fields: {
            originalURL: text({ 
                validation: { isRequired: true } 
            }),
            shortenedURL: text({ 
                validation: { isRequired: true },
                isIndexed: 'unique',
             }), 
            isPrivate: checkbox({
                defaultValue: false,
            }),
            privatePass: text(),
            owner: relationship({
                ref: "User.links",
                many: false,
            }),
            clicks: integer({
                defaultValue: 0,
            }),
            createdAt: timestamp({
                // this sets the timestamp to Date.now() when the user is first created
                defaultValue: { kind: "now" },
            }),
        },
    }),
};

export const extendGraphqlSchema = (schema: GraphQLSchema) =>
    mergeSchemas({
        schemas: [schema],
        typeDefs: `
            type Mutation {
                generateShortenedURL(url: String!, isPrivate: Boolean, privatePass: String): ShortenedLink
            },
            type Query {
                getURL(urlID: String!, privatePass: String): ShortenedLink
            }
        `,
        resolvers: {
            Mutation: {
                generateShortenedURL: generateShortenedURL
            },
            Query: {
                getURL: getURL
            },
        },
    });
