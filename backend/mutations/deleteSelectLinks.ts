import type { Lists, Context } from ".keystone/types";
import { Session } from "../types";

// Define a custom output type
export type DeleteLinksResult = {
    success: boolean;
    message: string;
    failedDeletions?: string[];
};

async function deleteSelectLinks(
    root: any,
    { shortenedURLs }: { shortenedURLs: string[] },
    context: Context
): Promise<DeleteLinksResult> {
    const sesh = context.session as Session;

    if (!sesh.itemId) {
        throw new Error("Invalid User Entry");
    }

    const links = await context.db.ShortenedLink.findMany({
        where: {
            owner: { id: { equals: sesh.itemId } },
            shortenedURL: {
                in: shortenedURLs,
            },
        },
        resolveFields: "id shortenedURL",
    });

    const failedDeletions: string[] = [];

    for (const link of links) {
        try {
            await context.db.ShortenedLink.deleteOne({
                where: {
                    id: link.id,
                },
            });
        } catch (error) {
            // If there was an error during deletion, add the id to the failedDeletions array
            failedDeletions.push(link.shortenedURL);
        }
    }

    // If there were failed deletions, return an object with success: false and details about the failed deletions
    if (failedDeletions.length > 0) {
        return {
            success: false,
            message: "Some deletions failed.",
            failedDeletions: failedDeletions,
        };
    }

    // If all deletions were successful, return an object with success: true
    return {
        success: true,
        message: "All deletions successful.",
    };
}

export default deleteSelectLinks;
