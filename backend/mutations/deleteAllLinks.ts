import type { Lists, Context } from ".keystone/types";
import { Session } from "../types";
import { DeleteLinksResult } from "./deleteSelectLinks";

// Define a custom output type
async function deleteAllLinks(
    root: any,
    context: Context
  ): Promise<DeleteLinksResult> {
    const sesh = context.session as Session;
  
    if (!sesh.itemId) {
      throw new Error("Invalid User Entry");
    }
  
    const links = await context.lists.ShortenedLink.findMany({
      where: {
        owner: { id: sesh.itemId },
      },
      resolveFields: "id",
    });
  
    const failedDeletions: string[] = [];
  
    for (const link of links) {
      try {
        await context.lists.ShortenedLink.deleteOne({ id: link.id });
      } catch (error) {
        // If there was an error during deletion, add the id to the failedDeletions array
        failedDeletions.push(link.id);
      }
    }
  
    // If there were failed deletions, return an object with success: false and details about the failed deletions
    if (failedDeletions.length > 0) {
      return {
        success: false,
        message: 'Some deletions failed.',
        failedDeletions: failedDeletions,
      };
    }
  
    // If all deletions were successful, return an object with success: true
    return {
      success: true,
      message: 'All deletions successful.',
    };
  }
  
  export default deleteAllLinks;
  