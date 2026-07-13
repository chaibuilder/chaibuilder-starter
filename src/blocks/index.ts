import { registerChaiBlock } from 'chaipro/registry'
import dynamic from 'next/dynamic'
import { FormConfig } from './form/form-block'

//Important: Dynamic import is required for custom blocks
const ChaiForm = dynamic(() => import('./form/form-block'))

export const registerCustomBlocks = () => {
  registerChaiBlock(ChaiForm, FormConfig)
}
