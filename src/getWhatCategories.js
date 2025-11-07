import * as cheerio from 'cheerio'
import {append,tap,map,pipe,andThen} from 'ramda'

const deprecatedElementsURL = 'https://html.spec.whatwg.org/multipage/obsolete.html'
const elementCategoriesURL = "https://html.spec.whatwg.org/multipage/indices.html"
const categoriesSelector = "#element-content-categories + p + table tbody tr"
const extractRows = doc => Array.from(doc('#element-content-categories + p + table tbody tr'))
const extractObsolete  = doc => Array.from(doc("dl:first-of-type dt"))
const rowsToData =
  doc => tr => (
    { category: doc(tr)
                .find("td:nth-of-type(1)")
                .text()
                .replace(/elements|content/,"")
                .replace(/\s+/g,' ')
                .trim()
                .replace(/ /g,'-')
                .toLowerCase()
    , elements: Array.from(doc(tr).find('td:nth-of-type(2) code'))
                .map( x => doc(x).text())
    })

export const getWhatObsolete =
  async _ => pipe
    ( async _ => await (await fetch(deprecatedElementsURL)).body.text()
    , andThen(cheerio.load)
    , andThen( doc => pipe
          ( extractObsolete
          , map(el => doc(el).text())
          )(doc))
    )(_)

export const getWhatCategories =
  async _ => pipe
    ( async _ => await (await fetch(elementCategoriesURL)).body.text()
    , andThen(cheerio.load)
    , andThen( async doc => pipe
          ( extractRows
          , map(rowsToData(doc))
          , append({category: "obsolete",elements: await getWhatObsolete()})
          )(doc))
    )(_)

//await getWhatObsolete()
