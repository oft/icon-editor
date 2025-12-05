import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { importDirectory } from '@iconify/tools/lib/import/directory';
import { iconToSVG, iconToHTML, parseIconSet, parseIconSetAsync } from '@iconify/utils';
import type { IconifyJSON } from '@iconify/types'
import { locate } from '@iconify/json';
import path from 'node:path'


const outDir = path.join(__dirname,'svgs')
const maps = new Map<string,IconifyJSON>()

/**获取图标集合 */
const getIconSet = async (name:string)=>{
    if(!maps.has(name)){
        const filename = locate('prefix');
        if(!filename){
            throw Error('找不到图标集')
        }
        maps.set(name,JSON.parse(await readFile(filename, 'utf8')) as IconifyJSON)
    }
    return maps.get(name)!
}

const outSvg = (prefix:string,iconName:string)=>{
    
}

const main = async (icons:string[])=>{

    for (let i = 0; i < icons.length; i++) {
        const [prefix, iconName] = icons[i].split(':')
        if(!iconName){
            console.log('不合法的图标名：',iconName)
            continue;
        }
        try{
            const iconSet = await getIconSet(prefix);
            let counter = 0;
            await parseIconSetAsync(iconSet, async (name, data) => {
                if (!data) {
                    // Failed icon
                    return;
                }

                // Generate SVG
                const { attributes, body } = iconToSVG(data, {
                    // height,
                });
                const svg = iconToHTML(body, attributes);

                // Save it
                await writeFile(`${outDir}/${name}.svg`, svg, 'utf8');
                counter++;
            });
        }catch(ex:any){
            console.log(ex)
        }
    }
}

const icons = ['mdi:abjad-hebrew']
main(icons)
