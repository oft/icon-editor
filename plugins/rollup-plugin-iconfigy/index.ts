// src/index.ts


export interface RawContent {
  extension: string
  raw: string
}

export interface PurgeIconsOptions {
  content?: (string | RawContent)[]
  included?: string[]
  // TODO:
  // includedCollections?: CollectionId[]
  // defaultExtractor?: Extractor
  // extractors?: Extractor[]
  // iconSource?: IconSource
  // remoteDataAPI?: string
  // iconifyImportName?: string
  // format?: OutputFormat
}

export async function PurgeIcons(options: PurgeIconsOptions = {}) {
  // const icons = await Extract(options)
  // const code = await CodeGen([...icons, ...(options.included || [])], options)
  return //code
}


// ../constants/index.ts
var IMPORT_PATHS = [
  "@purge-icons/generated",
  "vite-plugin-purge-icons/generated",
  "rollup-plugin-purge-icons/generated"
];

// src/index.ts
function CreatePlugin(options:any) {
  return {
    name: "purge-icons",
    resolveId(id:any) {
      if (IMPORT_PATHS.includes(id))
        return id;
    },
    async load(id:any) {
      if (IMPORT_PATHS.includes(id))
        return await PurgeIcons(options);
    }
  };
}

export {
  CreatePlugin as default
};