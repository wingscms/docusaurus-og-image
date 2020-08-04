import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest } from './types';

export function parseRequest(req: IncomingMessage) {
    const { pathname, query } = parse(req.url || '/', true);
    const {
        title,
        siteTitle,
        logo,
        theme,
        md,
        version,
        authorName,
        authorImage,
        docusaurusStamp
    } = (query || {});

    if (Array.isArray(title) ||
        Array.isArray(siteTitle) ||
        Array.isArray(logo) ||
        Array.isArray(theme) ||
        Array.isArray(md) ||
        Array.isArray(version) ||
        Array.isArray(authorName) ||
        Array.isArray(authorImage) ||
        Array.isArray(docusaurusStamp)) {
        throw new Error('Received multiple parameters of same type');
    }
    
    const arr = (pathname || '/').slice(1).split('.');
    let extension = '';
    let text = '';
    if (arr.length === 0) {
        text = '';
    } else if (arr.length === 1) {
        text = arr[0];
    } else {
        extension = arr.pop() as string;
        text = arr.join('.');
    }

    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        title: decodeURIComponent(text),
        theme: theme === 'dark' ? 'dark' : 'light',
        md: md === '1' || md === 'true',
        siteTitle: siteTitle || 'Docusaurus Site',
        logo: logo || 'https://docusaurus.io/img/docusaurus.svg',
        authorName: authorName || '',
        authorImage: authorImage || '',
        version: version || '',
        docusaurusStamp: docusaurusStamp === '1' || docusaurusStamp === 'true',
    };
    return parsedRequest;
}
