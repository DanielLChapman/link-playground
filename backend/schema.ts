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

export const lists = {
    User: list({
        access: allowAll,
        fields: {
            username: text({
                validation: {isRequired: true},
                isIndexed: "unique",
            }),
            password: password({validation: {isRequired: true}}),
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
                            const existingUser: User[] = await context.db.User.findMany(
                                {
                                    where: { email: { equals: email } },
                                }
                            ) as unknown as User[];

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

        }
    })
}

export const extendGraphqlSchema = (schema: GraphQLSchema) =>
    mergeSchemas({
        schemas: [schema],
        typeDefs: ``,
        resolvers: {
            Mutation: {},
            Query: {},
        },
    }
);