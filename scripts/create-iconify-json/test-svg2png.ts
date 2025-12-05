import sharp from 'sharp';
import path from 'node:path'
import fs from 'node:fs/promises'

const __dirname = import.meta.dirname;
const root = path.join(__dirname, 'svgs');
sharp(path.join(root, 'rect.svg'))
    .resize(200)
    .png()
    .toFile(path.join(__dirname, 'output.png'), (err, _info) => {
        if (err) console.error(err);
    });

// puppeteer 使用浏览器截屏的方式
async function svgToPng(svg:string) {
    const puppeteer = await import("puppeteer");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 200,
        height: 200,
        deviceScaleFactor: 1 // 可以设置为 2 来获得 Retina 分辨率的图片
    });
    await page.setContent(`
        <!DOCTYPE html>
        <html>
            <body style="margin: 0; padding: 0;">
                <div style="width: ${200}px; height: ${200}px;">
                    ${svg}
                </div>
            </body>
        </html>`);
    const png = await page.screenshot({ type: "png" });
    await browser.close();
    return png;
}

fs.readFile(path.join(root, 'rect.svg'),'utf-8')
.then(svgToPng)
.then(d=>fs.writeFile(path.join(__dirname, 'output2.png'),d))