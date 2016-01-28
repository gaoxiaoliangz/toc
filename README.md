# Outliner
Generate outline of your document via JavaScript based on the h tags

## Usage

```
Outliner(".content",{
  hasNavMenu: true
})
```

Or you can you use Outliner in the jQuery style

```
$(".content").outliner({
  hasNavMenu: true
})
```

## Parameters
Outliner(selector, config)

### selector
`selector` is the content you want Outliner to process.

### config
| option name | default value | description |
| ----------- | ------------- | ----------- |
| hasNavMenu | true | show the navigation menu on the top of the page |
