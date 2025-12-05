import { readFile, writeFile } from 'node:fs/promises';
import { getIconsCSS } from '@iconify/utils';
import { locate } from '@iconify/json';

/**
* List of icons. Key is icon set prefix, value is array of icons
*
* @type {Record<string, string[]>}
*/
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

// Parse each icon set
let code = '';
for (const iconset of icons) {
    // Find location of .json file
    const filename = locate(iconset.prefix);

    // Load file and parse it
    /** @type {import("@iconify/types").IconifyJSON} */
    const iconSet = JSON.parse(await readFile(filename, 'utf8'));

    // Get CSS
    const css = getIconsCSS(iconSet, iconset.icons);

    // Add it to code
    code += css;
}

// Save CSS file
await writeFile('assets/style.css', code, 'utf8');
console.log(`Saved CSS (${code.length} bytes)`);