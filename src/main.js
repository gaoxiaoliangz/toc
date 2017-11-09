import { guid, last } from './utils'

const defaultConfig = {
  container: 'body',
  tocTag: ['{{TOC}}', '[TOC]']
}

const OUTLINE_TAGS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']

function Outline(config) {
  this.config = Object.assign({}, defaultConfig, config)
  this.$container = document.querySelector(this.config.container)
  const tags = findHTags(this.$container)
  markTags(tags)
  const sections = buildStructure(tags)
  const $toc = genTOCDom(sections).innerHTML
  this.$container.innerHTML = this.$container.innerHTML.replace(this.config.tocTag[0], $toc)
}

function getLevel(hTag) {
  if (!hTag) {
    return
  }
  return Number(hTag.tagName.substr(1))
}

function getHTagText(hTag) {
  if (!hTag) {
    return ''
  }
  return hTag.innerHTML
}

function findHTags($container) {
  const tags = []
  const exec = children => {
    Array.prototype.forEach.call(children, element => {
      if (OUTLINE_TAGS.includes(element.tagName)) {
        tags.push(element)
      } else if (element.childNodes && element.childNodes.length !== 0) {
        exec(element.childNodes)
      }
    })
  }
  exec($container.childNodes)
  return tags
}

function markTags(tags) {
  tags.forEach(tag => {
    tag.setAttribute('id', guid())
  })
}

/**
 * @param { element[] } tags
 * @return { (node: { element, children: node[] })[] }
 */
function buildStructure(tags) {
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

function genTOCDom(sections) {
  const createChildren = children => {
    const $ul = document.createElement('ul')
    children.forEach(child => {
      const $li = document.createElement('li')
      const $text = document.createTextNode(getHTagText(child.element))
      $li.appendChild($text)
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

export default config => {
  return new Outline(config)
}
