export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';

export interface ParsedRequest {
    fileType: FileType;
    title: string;
    theme: Theme;
    md: boolean;
    logo: string;
    siteTitle: string;
    version: string;
    docusaurusStamp: boolean;
}
