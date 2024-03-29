import { list } from "@keystone-6/core";
import { allOperations, allowAll } from "@keystone-6/core/access";

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
import { isSignedIn, permissions, rules } from "./access";
import deleteSelectLinks from "./mutations/deleteSelectLinks";
import deleteAllLinks from "./mutations/deleteAllLinks";

export const lists = {
    User: list({
        access: {
            operation: {
                ...allOperations(isSignedIn),
                create: permissions.canManagePeople,
                delete: permissions.canManagePeople,
            },
            filter: {
                query: rules.canReadPeople,
                update: rules.canUpdatePeople,
            },
        },
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
            rootNodes: relationship( {
                ref: 'TreeNode.owner',
                many: true,
            }),
            createdAt: timestamp({
                // this sets the timestamp to Date.now() when the user is first created
                defaultValue: { kind: "now" },
            }),
            role: relationship({
                ref: "Role.assignedTo",
                access: {
                    create: permissions.canManagePeople,
                    update: permissions.canManagePeople,
                },
                ui: {
                    itemView: {
                        fieldMode: (args) =>
                            permissions.canManagePeople(args) ? "edit" : "read",
                    },
                },
            }),
        },
        hooks: {
            validateDelete: async ({ context, item, addValidationError }) => {
                const links = await context.db.ShortenedLink.findMany({
                    where: { owner: { id: item.id } },
                });

                for (const link of links) {
                    await context.db.ShortenedLink.deleteOne({
                        where: {
                            id: link.id.toString(),
                        }
                        
                    });
                }
            },
        },
    }),
    ShortenedLink: list({
        access: {
            operation: {
                ...allOperations(allowAll),
                delete: permissions.canManageAllLinks,
            },
            filter: {
                update: rules.canManageAllLinks,
                delete: rules.canManageAllLinks,
            },
        },
        fields: {
            originalURL: text({
                validation: { isRequired: true },
            }),
            shortenedURL: text({
                validation: { isRequired: true },
                isIndexed: "unique",
            }),
            isPrivate: checkbox({
                defaultValue: false,
            }),
            privatePass: text(),
            owner: relationship({
                ref: "User.links",
                many: false,
            }),
            treeNode: relationship({
                ref: 'TreeNode.link',
                many: true, // if you allow a link to be part of multiple trees/nodes
            }),
            clicks: integer({
                defaultValue: 0,
            }),
            createdAt: timestamp({
                // this sets the timestamp to Date.now() when the user is first created
                defaultValue: { kind: "now" },
            }),
            name: text(),
        },
    }),
    TreeNode: list({
        access: {
            operation: {
                ...allOperations(permissions.canManageOthersTrees),
            },
            filter: {
                update: rules.canManageTree,
                delete: rules.canManageTree,
            },
        },
        fields: {
            type: select({
                options: [
                    { label: 'Category', value: 'category' },
                    { label: 'Link', value: 'link' }
                ],
                validation: { isRequired: true }
            }),
            name: text({ validation: { isRequired: true } }), // Used for category name, and can be used as display text for link nodes if needed.
            link: relationship({
                ref: 'ShortenedLink.treeNode',
                many: false, // Each TreeNode links to at most one ShortenedLink, but a ShortenedLink can be part of multiple TreeNodes (if you allow that).
            }),
            owner: relationship({
                ref: "User.treeNodes",
                many: false,
            }),
            parent: relationship({
                ref: "TreeNode.children",
                many: false,
            }),
            children: relationship({
                ref: "TreeNode.parent",
                many: true,
            }),
            order: integer({
                validation: { isRequired: true },
                defaultValue: 0,
            }),
            createdAt: timestamp({
                // this sets the timestamp to Date.now() when the user is first created
                defaultValue: { kind: "now" },
            }),
        },
        hooks: {
            validateDelete: async ({ context, item, addValidationError }) => {
                const categories = await context.db.TreeNode.findMany({
                    where: { childCategories: { id: item.id } },
                });

                for (const link of categories) {
                    await context.db.Category.deleteOne({
                        where: {
                            id: link.id.toString(),
                        }
                        
                    });
                }
            },
        },
    }),
    Role: list({
        /*
          SPEC
          - [x] Block all public access
          - [x] Restrict edit access based on canManageRoles
          - [ ] Prevent users from deleting their own role
          - [ ] Add a pre-save hook that ensures some permissions are selected when others are:
              - [ ] when canEditOtherPeople is true, canSeeOtherPeople must be true
              - [ ] when canManagePeople is true, canEditOtherPeople and canSeeOtherPeople must be true
          - [ ] Extend the Admin UI with client-side validation based on the same set of rules
        */
        access: {
            operation: {
                ...allOperations(allowAll),
                query: isSignedIn,
            },
        },
        ui: {
            hideCreate: (args) => !permissions.canManageRoles(args),
            hideDelete: (args) => !permissions.canManageRoles(args),
            listView: {
                initialColumns: ["name", "assignedTo"],
            },
            itemView: {
                defaultFieldMode: (args) =>
                    permissions.canManageRoles(args) ? "edit" : "read",
            },
        },
        fields: {
            name: text({ validation: { isRequired: true } }),

            canDeleteLink: checkbox({ defaultValue: false }),

            canManageAllLinks: checkbox({ defaultValue: false }),
            /* See Other Users means:
             - list all users in the database (users can always see themselves) */
            canSeeOtherPeople: checkbox({ defaultValue: false }),
            /* Edit Other Users means:
             - edit other users in the database (users can always edit their own item) */
            canEditOtherPeople: checkbox({ defaultValue: false }),
            /* Manage Users means:
             - change passwords (users can always change their own password)
             - assign roles to themselves and other users */
            canManagePeople: checkbox({ defaultValue: false }),
            /* Manage Roles means:
             - create, edit, and delete roles */
            canManageRoles: checkbox({ defaultValue: false }),
            /* Use AdminUI means:
             - can access the Admin UI next app */
            canUseAdminUI: checkbox({ defaultValue: false }),
            canManageOthersTrees: checkbox({ defaultValue: false }),
            canManageTree: checkbox({ defaultValue: false }),

            assignedTo: relationship({
                ref: "User.role",
                many: true,
                ui: {
                    itemView: { fieldMode: "read" },
                },
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
                deleteSelectLinks(shortenedURLs: [String!]!): DeleteLinkResult!
                deleteAllLinks: DeleteLinkResult!
            },
            type Query {
                getURL(urlID: String!, privatePass: String): ShortenedLink
            },
            type DeleteLinkResult {
                success: Boolean!
                message: String!
                failedDeletions: [ID!]
            }
        `,
        resolvers: {
            Mutation: {
                generateShortenedURL: generateShortenedURL,
                deleteSelectLinks: deleteSelectLinks,
                deleteAllLinks: deleteAllLinks
            },
            Query: {
                getURL: getURL,
            },
        },
    });
