import { lookupCollection } from '@iconify/json'
import { getIconData, iconToSVG, iconToHTML } from '@iconify/utils'
import fs from 'node:fs/promises'
import path from 'node:path'
const icons = [
    {
        prefix: 'vscode-icons',
        icons: [
            "file-type-powerpoint2"
        ]
    },
    {
        prefix: "material-icon-theme",
        icons: [
            "word", "pdf"
        ]
    }
]
async function run() {
    for (const iconset of icons) {
        const json = await lookupCollection(iconset.prefix)
        for (const icon of iconset.icons) {
            const iconfiyIcon = getIconData(json, icon)!
            const svg = iconToSVG(iconfiyIcon, {
                // 可重置尺寸
                // width:640,
                // height:640,
            })
            await fs.writeFile(path.join(__dirname, `${iconset.prefix}_${icon}.svg`), iconToHTML(svg.body,svg.attributes), 'utf-8')
        }
    }
}
run()
