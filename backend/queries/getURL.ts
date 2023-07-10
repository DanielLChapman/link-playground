import type { KeystoneContext, SessionStore } from '@keystone-6/core/types';
import type { Lists, Context } from '.keystone/types';
import { Session, ShortenedLink } from '../types';

async function getURL(root: any, { urlID, privatePass }: { urlID: string, privatePass: string }, context: Context) {
    const sesh = context.session as Session;
    
    if (typeof urlID !== 'string' || urlID.length === 0) {
        throw new Error('Invalid URL');
    }

    const linkData = await context.db.ShortenedLink.findOne({
        where: {
            shortenedURL: urlID
        }
    });

    if (!linkData) {
        throw new Error('Invalid URL');
    }

    if (linkData.isPrivate 
        && !(sesh.itemId && linkData.ownerId === sesh.itemId) 
        && !(linkData.privatePass === privatePass && privatePass.length > 0)) {
        throw new Error("You don't have permission to view this link");
    }

    await context.db.ShortenedLink.updateOne({
        where: {
            shortenedURL: linkData.shortenedURL
        },
        data: {
            clicks: linkData.clicks + 1,
        }
    });

    return linkData
}


export default getURL