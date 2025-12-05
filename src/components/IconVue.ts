
import { Icon, addCollection } from '@iconify/vue'
import AntDesign from '@iconify-json/ant-design/icons.json'
import VscodeIcons from '@iconify-json/vscode-icons/icons.json'
import fluent from '@iconify-json/fluent/icons.json'
import my from './MyIcon/src/my.json'

addCollection(AntDesign)
addCollection(VscodeIcons)
addCollection(fluent as any)
addCollection(my as any)
export default Icon