
import { Icon, addCollection } from '@iconify/vue'

import my from './MyIcon/src/my.json'

addCollection(my as any)

const fetchIconJSON = (name:string,version:string|number='latest')=>{
    return fetch(`https://registry.npmmirror.com/@iconify-json/${name}/${version}/files/icons.json`)
    .then(d=>d.json())
}

const useLocalJson = ()=>{
    return Promise.all([
        fetchIconJSON('ant-design',1).then(addCollection),
        fetchIconJSON('vscode-icons').then(addCollection),
        fetchIconJSON('fluent').then((d:any)=>addCollection(d)),
    ])
}

export {
    useLocalJson
}

export default Icon