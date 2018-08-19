// @ts-check
import { guid, last } from './utils'

const H_TAGS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']

const generate = (input, { markHTags = true } = {}) => {
  // input is dom el
  const hTags = findHTags(input)
  if (markHTags) {
    markTags(hTags)
  }
  const toc = buildStructure(hTags)
  const tocDOM = genTOCDom(toc)
  return tocDOM
}

const findHTags = $container => {
  const tags = []
  const exec = children => {
    Array.prototype.forEach.call(children, element => {
      if (H_TAGS.includes(element.tagName)) {
        tags.push(element)
      } else if (element.childNodes && element.childNodes.length !== 0) {
        exec(element.childNodes)
      }
    })
  }
  exec($container.childNodes)
  return tags
}

const markTags = tags => {
  tags.forEach(tag => {
    if (!tag.getAttribute('id')) {
      tag.setAttribute('id', guid())
    }
  })
  return tags
}

const getLevel = hTag => {
  if (!hTag) {
    return
  }
  return Number(hTag.tagName.substr(1))
}

/**
 * @param { HTMLElement[] } tags
 * @return { ({ element, children: any[] })[] }
 */
const buildStructure = tags => {
  const addEleToSection = (element, section) => {
    if (!section.children) {
      section.children = [{ element }]
      return
    }
    const lastChildNode = last(section.children) || {}
    const lastChildNodeLevel = lastChildNode && getLevel(lastChildNode.element)
    const elementLevel = getLevel(element)

    if (elementLevel === lastChildNodeLevel) {
      section.children.push({ element })
      return
    }
    if (elementLevel > lastChildNodeLevel && lastChildNode.children) {
      addEleToSection(element, lastChildNode)
      return
    }
    lastChildNode.children = [{ element }]
    return
  }

  const sections = []
  let lastLevel
  let lastSection
  tags.forEach((element, index) => {
    const level = getLevel(element)
    if (!lastLevel || getLevel(lastSection.element) >= level) {
      sections.push({ element })
    } else {
      addEleToSection(element, lastSection)
    }
    lastLevel = level
    lastSection = sections[sections.length - 1]
  })
  return sections
}

const getHTagText = hTag => {
  if (!hTag) {
    return ''
  }
  return hTag.innerHTML
}

const genTOCDom = sections => {
  const createChildren = children => {
    const $ul = document.createElement('ul')
    children.forEach(child => {
      const $li = document.createElement('li')
      const hash = child.element.getAttribute('id')
      const template = `<a href="#${hash || ''}">${getHTagText(child.element)}</a>`
      $li.innerHTML = template
      $ul.appendChild($li)
      if (child.children) {
        const $liWithChildren = document.createElement('li')
        $liWithChildren.appendChild(createChildren(child.children))
        $ul.appendChild($liWithChildren)
      }
    })
    return $ul
  }

  return createChildren(sections)
}

window['toc'] = {
  generate,
}
