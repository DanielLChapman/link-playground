// cronJobs.js

import { KeystoneContext } from "@keystone-next/keystone/schema";
import { context } from './keystone';

const deleteOldLinks = async () => {
  const sixtyDaysAgo = new Date(new Date().getTime() - 60 * 24 * 60 * 60 * 1000);

  try {
    // Assuming context is an instance of KeystoneContext
    await context.lists.ShortenedLink.deleteMany({
      where: {
        owner: null,
        createdAt: { lte: sixtyDaysAgo.toISOString() }
      },
    });
  } catch (error) {
    console.error("Error deleting old links:", error);
  }
};

setInterval(deleteOldLinks, 24 * 60 * 60 * 1000); // Runs every 24 hours.

export default { deleteOldLinks };
