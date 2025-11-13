import {getWhatCategories} from './getWhatCategories.js'
import {generateSCSSVars} from './generateSCSSVars.js'
import {writeFileSync} from 'node:fs';

const vars = generateSCSSVars(await getWhatCategories())
writeFileSync(__dirname+'/_html_element_categories.scss',vars)
