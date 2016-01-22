# Outliner
Generate outline of your document via JavaScript based on the h tags

## Usage
First, include outliner.min.js and outliner.min.css in the page which you want Outliner to appear. Then you call Outliner in this way

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

## Options
Outliner(selector, config)

### selector
`selector` is the content you want Outliner to process.

### config
Currently Outliner has only one option called `hasNavMenu`, set to `true` if want the navigation menu to appear on the top of the page.
