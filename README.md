# outline.js

Generate the outline of your document via JavaScript based on h tags

## Usage

```
Outline(".content",{
  hasNavMenu: true
})
```

Or you can you use Outline in the jQuery style

```
$(".content").outline({
  hasNavMenu: true
})
```

## Parameters
Outline(selector, config)

### selector
`selector` is the content you want Outline to process.

### config
| option name | default value | description |
| ----------- | ------------- | ----------- |
| hasNavMenu | true | show the navigation menu on the top of the page |
