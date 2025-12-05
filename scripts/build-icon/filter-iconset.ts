import { lookupCollection } from '@iconify/json'
import { getIcons } from '@iconify/utils'
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
        const newjson = getIcons(json, iconset.icons)
        await fs.writeFile(path.join(__dirname,`${iconset.prefix}.json`), JSON.stringify(newjson,null,4), 'utf-8')
    }
}
run()


