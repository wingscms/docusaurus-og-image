// import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

// const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
// const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
// const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getFontSize(text: string) {
    const minSize = 50
    const maxSize = 180
    const scaleFactor = 4
    const minStringLength = 8
    const adjustedLength = text.length - minStringLength
    console.log(adjustedLength)
    const scaledFontSize = maxSize - (adjustedLength > 0 ? adjustedLength : 0) * scaleFactor
    console.log(scaledFontSize)
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
        height: 100vh;
        margin: 0;
      }
      
      .text {
        color: ${foreground};
        font-family: 'Helvetica Neue', sans-serif;
        margin: 0;
      }
      
      .container {
        padding: 17% 12%;
        padding-bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      
      .site-info {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
      }
      
      .logo-wrapper {
        display: flex;
        align-items: center;
      }
      
      .logo {
        width: 80px;
        margin-right: 15px;
      }
      
      .siteTitle {
        font-size: 60px;
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
        font-style: normal;
        line-height: 1.8;
      }
      
      .author {
        display: flex;
        align-items: center;
        margin-bottom: 120px;
      }
      
      .avatar {
        border-radius: 100%;
        width: 50px;
      }
      
      .name {
        font-size: 30px;
        font-style: normal;
        line-height: 1.8;
        margin-left: 25px;
      }
      
      .stamp {
        display: flex;
        align-items: center;
      }
      
      .stamp-text {
        font-size: 15px;
        color: #505050;
      }
      
      .stamp-image {
        width: 40px;
        margin-left: 10px;
        filter: grayscale();
      }`;
}

// function getCssOld(theme: string, fontSize: string) {
//     let background = 'white';
//     let foreground = 'black';

//     if (theme === 'dark') {
//         background = 'black';
//         foreground = 'white';
//     }
//     return `
//     @font-face {
//         font-family: 'Inter';
//         font-style:  normal;
//         font-weight: normal;
//         src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
//     }

//     @font-face {
//         font-family: 'Inter';
//         font-style:  normal;
//         font-weight: bold;
//         src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
//     }

//     @font-face {
//         font-family: 'Vera';
//         font-style: normal;
//         font-weight: normal;
//         src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
//       }

//     body {
//         background: ${background};
//         background-size: 100px 100px;
//         height: 100vh;
//         margin: 0;
//     }

//     .container {
//         padding: 17% 12%;
//         padding-bottom: 0;
//         display: flex;
//         flex-direction: column;
//         justify-content: center;
//     }

//     .text {
//         font-family: 'Helvetica Neue', 'Inter', sans-serif;
//         color: ${foreground};
//         margin: 0;
//     }

//     .site-info {
//         display: flex;
//         justify-content: space-between;
//         flex-wrap: nowrap;
//     }

//     .logo-wrapper {
//         display: flex;
//         align-items: center;
//     }

//     .logo {
//         width: 80px;
//         margin-right: 15px;
//     }

//     .siteTitle {
//         font-size: 60px;
//         font-style: normal;
//         line-height: 1.8;
//     }

//     .emoji {
//         height: 1em;
//         width: 1em;
//         margin: 0 .05em 0 .1em;
//         vertical-align: -0.1em;
//     }
    
//     .heading {
//         font-size: ${sanitizeHtml(fontSize)};
//         font-style: normal;
//         line-height: 1.8;
//     }
    
//     .author {
//         display: flex;
//         align-items: center;
//         margin-bottom: 120px;
//       }
      
//       .avatar {
//         border-radius: 100%;
//         width: 50px;
//       }
      
//       .name {
//         font-size: 30px;
//         font-style: normal;
//         line-height: 1.8;
//         margin-left: 25px;
//       }
      
//       .stamp {
//         display: flex;
//         align-items: center;
//       }
      
//       .stamp-text {
//         font-size: 15px;
//       }
      
//       .stamp-image {
//         width: 40px;
//         margin-left: 10px;
//         filter: grayscale();
//       }`;
// }

export function getHtml(parsedReq: ParsedRequest) {
    const { title, theme, md, siteTitle, logo, version } = parsedReq;
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
            <div>
                <div class="text heading">
                    ${emojify(
                        md ? marked(title) : sanitizeHtml(title)
                    )}
                </div>
                <div class="author">
                    <img class="avatar" src="https://avatars1.githubusercontent.com/u/3757713?s=460&u=701ce82ff900c0a6dabf6fba70adace00e4e8d7f&v=4"/>
                    <div class="text name">Joel Marcey</div>
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
                <div class="text stamp-text">Made with Docusaurus</div>
                <img class="stamp-image" src="https://docusaurus.io/img/docusaurus.svg" />
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
