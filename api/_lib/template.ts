// import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

function getFontSize(text: string) {
    const minSize = 90
    const maxSize = 180
    const scaleFactor = 4
    const minStringLength = 8
    const adjustedLength = text.length - minStringLength
    const scaledFontSize = maxSize - (adjustedLength > 0 ? adjustedLength : 0) * scaleFactor
    console.log(`"${text}": ${(scaledFontSize > minSize ? scaledFontSize : minSize).toString()}px`)
    return `${(scaledFontSize > minSize ? scaledFontSize : minSize).toString()}px` 
}

function getCss(theme: string, fontSize: string) {
    let background = 'white';
    let foreground = 'black';

    if (theme === 'dark') {
        background = 'black';
        foreground = 'white';
    }
    return `
    body {
        background: ${background};
        background-size: 100px 100px;
        margin: 0;
      }
      
      p {
        margin: 0;
      }

      .text {
        color: ${foreground};
        font-family: 'Helvetica Neue', sans-serif;
        margin: 0;
      }

      .container {
        height: 100vh;
        padding: 0 12%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      
      .title-container {
        margin-top: 350px;
      }

      .site-info {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        margin-bottom: 100px;
      }
      
      .logo-wrapper {
        display: flex;
        align-items: center;
      }
      
      .logo {
        height: 120px;
        margin-right: 15px;
      }
      
      .siteTitle {
        font-size: 90px;
        font-style: normal;
        line-height: 1.8;
      }
      
      .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
      }
      
      .heading {
        font-size: ${fontSize};
        font-weight: 500;
        line-height: 1.3;
      }
      
      .author {
        display: flex;
        align-items: center;
        margin-top: 50px;
        margin-bottom: 120px;
      }
      
      .avatar {
        border-radius: 100%;
        width: 80px;
      }
      
      .name {
        font-size: 40px;
        font-style: normal;
        line-height: 1.8;
        margin-left: 25px;
      }
      
      .stamp {
        display: flex;
        align-items: end;
      }
      
      .stamp-text {
        font-size: 30px;
        color: #505050;
      }
      
      .stamp-image {
        width: 50px;
        margin-left: 10px;
        filter: grayscale();
      }
      
      .version {
        margin-right: 40px;
        font-size: 40px;
      }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { title, theme, md, siteTitle, logo, version, authorName, authorImage, docusaurusStamp } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, getFontSize(title))}
    </style>
    <body>
        <div class="container">
            <div class="title-container">
                <div class="text heading">
                    ${emojify(
                        md ? marked(title) : sanitizeHtml(title)
                    )}
                </div>
                <div class="author">
                    <img class="avatar" src="${authorImage}"/>
                    <div class="text name">${authorName}</div>
                </div>
            </div>
            <div class="site-info">
              <div class="logo-wrapper">
                ${getImage(logo)}
                <div class="text siteTitle">
                    ${emojify(
                        md ? marked(siteTitle) : sanitizeHtml(siteTitle)
                    )}
                </div>
              </div>
              <div class="stamp">
                <div class="text version">${version}</div>
                ${
                  docusaurusStamp ?
                  `<div class="text stamp-text">Made with Docusaurus</div>
                  <img class="stamp-image" src="https://docusaurus.io/img/docusaurus.svg" />`
                  : ``
                }
              </div>
            </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width ='auto', height = '225') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}
