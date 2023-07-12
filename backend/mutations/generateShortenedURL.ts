import type { KeystoneContext, SessionStore } from '@keystone-6/core/types';
import type { Lists, Context } from '.keystone/types';
import { Session } from '../types';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7);

const generateUniqueShortenedURL = async (context: Context) => {
    let tempID = nanoid();
    while (true) {
        const link = await context.db.ShortenedLink.findOne({
            where: {
                shortenedURL: tempID,
            },
        });
        if (!link) {
            return tempID;
        }
        tempID = nanoid();
    }
}

const isValidURLWithRegExp = (url: string): boolean => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?'+ // port
        '(\\/[-a-z\\d%_.~+]*)*'+ // path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
}

async function generateShortenedURL(root: any, { url, isPrivate, privatePass }: { url: string, isPrivate: boolean, privatePass: string }, context: Context) {
    if (!isValidURLWithRegExp(url)) {
        throw new Error('Invalid URL');
    }

    const sesh = context.session as Session;
    const shortenedURL = await generateUniqueShortenedURL(context);

    const linkData: any = {
        originalURL: url,
        shortenedURL,
        clicks: 0,
        isPrivate,
        privatePass,
    }

    if (sesh?.itemId) {
        linkData.owner = {
            connect: { id: sesh.itemId },
        }
    }

    const link = await context.db.ShortenedLink.createOne({
        data: linkData
    });

    return link;
}

export default generateShortenedURL