import { guid, last } from './utils'

const defaultConfig = {
  container: 'body',
  match: /\{\{TOC\}\}/g,
  inputHTML: '',
}

const OUTLINE_TAGS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']
const TOC_EL = 'otl-toc'

function Outline(config) {
  return new _Outline(config)
}

Outline.config = defaultConfig

Outline.buildTOC = function buildTOC($container) {
  return genTOCDom(buildStructure(markTags(findHTags($container))))
}

Outline.injectTOC = function injectTOC($container, match, $toc) {
  $container.innerHTML = $container.innerHTML.replace(match, $toc.outerHTML)
}

function _Outline(config) {
  this.config = Object.assign({}, defaultConfig, config)
  this.match = this.config.match
  this.$container = typeof this.config.container === 'string'
    ? document.querySelector(this.config.container)
    : this.config.container
  this.update()
}

_Outline.prototype._generateTOCDom = function _generateTOCDom() {
  return genTOCDom(buildStructure(markTags(findHTags(this.$container))))
}

_Outline.prototype.hasTocTag = function hasTocTag() {
  return this.match.test(this.$container.innerHTML)
}

_Outline.prototype.update = function update() {
  const $toc = this._generateTOCDom()
  if (document.querySelector(`.${TOC_EL}`)) {
    document.querySelector(`.${TOC_EL}`).innerHTML = $toc.innerHTML
  } else if (this.hasTocTag()) {
    this.$container.innerHTML = this.$container.innerHTML.replace(this.match, $toc.outerHTML)
  }
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
  return tags
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
    $ul.setAttribute('class', 'otl-list__ul')
    children.forEach(child => {
      const $li = document.createElement('li')
      const hash = child.element.getAttribute('id')
      const template = `<a class="otl-list__link" href="#${hash}">${getHTagText(child.element)}</a>`
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

  const $toc = document.createElement('div')
  const $tocWrap = document.createElement('div')
  $toc.setAttribute('class', TOC_EL)
  $tocWrap.setAttribute('class', 'otl-list')
  $tocWrap.appendChild(createChildren(sections))
  $toc.appendChild($tocWrap)
  return $toc
}

export default Outline
