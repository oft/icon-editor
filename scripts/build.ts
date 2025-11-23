import { promises as fs } from 'node:fs';
import { importDirectory } from '@iconify/tools/lib/import/directory';
import { cleanupSVG } from '@iconify/tools/lib/svg/cleanup';
import { runSVGO } from '@iconify/tools/lib/optimise/svgo';
import { parseColors, isEmptyColor } from '@iconify/tools/lib/colors/parse';
import path from 'node:path'

const __dirname = import.meta.dirname;

/**svg 目录*/
const root = path.join(__dirname, 'svgs');
/**输出图标集合*/
const out = path.join(__dirname, '../src/components/MyIcon/src');
export default async () => {
  // Import icons
  const iconSet = await importDirectory(root, {
    prefix: 'my',
  });

  // Validate, clean up, fix palette and optimise
  await iconSet.forEach(async (name, type) => {
    if (type !== 'icon') {
      return;
    }

    const svg = iconSet.toSVG(name);
    if (!svg) {
      // Invalid icon
      iconSet.remove(name);
      return;
    }

    // Clean up and optimise icons
    try {
      cleanupSVG(svg);
      await parseColors(svg, {
        defaultColor: 'currentColor',
        callback: (attr, colorStr, color) => {
          return !color || isEmptyColor(color)
            ? colorStr
            : 'currentColor';
        },
      });
      runSVGO(svg);
    } catch (err) {
      // Invalid icon
      console.error(`Error parsing ${name}:`, err);
      iconSet.remove(name);
      return;
    }

    // Update icon
    iconSet.fromSVG(name, svg);
  });

  // Export as IconifyJSON
  const exported = JSON.stringify(iconSet.export(), null, '\t') + '\n';

  // Save to file
  await fs.writeFile(`${out}/${iconSet.prefix}.json`, exported, 'utf8');
};