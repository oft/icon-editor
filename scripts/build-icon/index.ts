import { lookupCollection } from '@iconify/json'
import type { IconifyJSON } from '@iconify/types'
import { getIconData, iconToHTML, iconToSVG } from '@iconify/utils'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp';
import { readdir, rm, stat } from 'fs/promises';
import icons from './icons'
import debug from 'debug'

import type { IconifyIconCustomisations } from 'iconify-icon'

const log = debug('build:icons')
const outDir = path.join(import.meta.dirname, '../../public/iconify')

const parse = log.extend('解析')
const empty = log.extend('清除')
const create = log.extend('生成')

debug.enable('*')

console.log(`********************************
* iconfiy图标库精简工具
* auth zq
********************************
`)


const iconSetMaps = new Map<string, IconifyJSON>()

parse('解析完成', `共 [${iconSetMaps.size}] 个图标集`, `[${icons.length}] 个图标`)


const buildIcons = async () => {

  await emptyFolder(outDir)

  const iconsets: string[] = []
  for (const item of icons) {
    const iconObj = typeof item === 'string' ? { icon: item } : item
    const { height, width, alias, icon: name, color, svgAttrs, style } = iconObj
    const {
      styleStr,
      ...others
    } = svgAttrs || {}
    const [prefix, iconName] = name.split(':')
    if (!iconSetMaps.has(prefix)) {
      const json = await lookupCollection(prefix)
      iconSetMaps.set(prefix, json)
    }
    const json = iconSetMaps.get(prefix)!

    const iconData = getIconData(json, iconName)!
    const { width: iconWidth, height: iconHeight, body } = iconData

    const opts: IconifyIconCustomisations = {}
    if (typeof width === 'number') {
      opts.width = width
    } else if (typeof iconWidth === 'number') {
      opts.width = iconWidth
    }
    if (typeof height === 'number') { 
      opts.height = height 
    } else if (typeof iconHeight === 'number') {
      opts.height = iconHeight
    }
    const result = iconToSVG(iconData, opts)
    const attrs: Record<string, string> = {}
    const styles: Record<string, string> = {
      ...style
    }
    if (typeof color === 'string') { styles['color'] = color }


    const svgstr = iconToHTML(body, {
      ...result.attributes,
      ...attrs,
      ...others,
      style: Object.entries(styles).map(([k, v]) => `${k}:${v}`).join(';') + ';' + (styleStr || '') + ';'
    })

    const savesName = alias || name
    let filename = savesName.replace(':', '_');

    /**保存 png 图片 */
    await saveSvgAsPng(path.join(outDir, filename + ".png"), svgstr)
    create(`图标 ${name} 已输出到 ${filename}.svg`)
    await saveSvg(path.join(outDir, filename + '.svg'), svgstr)
    iconsets.push(filename)
  }

  await fs.writeFile(path.join(outDir, '此目录中文件自动生成.md'), `# 更新方式

修改 ../icons.ts , 添加要使用的图标

执行

\`\`\`bash
pnpm run build-icons
\`\`\`
`)

  create('README.md 文件已生成')

  log('任务完成，检查输出目录 ' + outDir)
  const htmlPath = path.join(outDir, 'index.html');
  const t = Date.now()
  const body = iconsets.map(n => `<img src="${n}.png?_=${t}"><img src="${n}.svg?_=${t}" />`).join('\n')
  await fs.writeFile(htmlPath, `<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <title>ICON Preview</title>
</head>
<body>
    ${body}
</body>
</html>`)

  log('预览地址 ' + htmlPath)

  console.log(`***************SUCCESS*****************`)
}

buildIcons()

async function emptyFolder(folderPath: string) {
  try {
    // 读取文件夹内所有内容
    const files = await readdir(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = await stat(filePath);

      // 判断是文件还是文件夹，分别删除
      if (stats.isDirectory()) {
        // 递归删除子文件夹（含内容）
        await rm(filePath, { recursive: true, force: true });
      } else {
        // 删除文件
        await rm(filePath, { force: true });
      }
    }
    empty(`文件夹 ${folderPath} 已清空`);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      empty(`文件夹 ${folderPath} 不存在，已自动创建`);
      // 若文件夹不存在，可选择创建空文件夹
      await fs.mkdir(folderPath, { recursive: true });
    } else {
      empty('清空文件夹失败：', err);
    }
  }
}

const saveSvgAsPng = (pngPng: string, svg: string, size?: { width: number, height: number }) => {
  const roundedCorners = Buffer.from(svg);
  return new Promise((resolve, reject) => {
    let result = sharp(roundedCorners)

    if (size && size.height && size.width) {
      result = result.resize(size.height , size.width)
    }

    result.toFile(pngPng, (err, info) => {
      if (err) {
        reject(err)
      } else {
        resolve(info)
      }
    });
  })
}

const saveSvg = (filename: string, svg: string) => {
  return fs.writeFile(filename, svg)
}