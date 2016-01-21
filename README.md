# Outliner
Generate outline of your document via JavaScript based on the h tags

## Basic usage
First, include outliner.min.js and outliner.min.css in the page which you want Outliner to appear. Then you call Outliner in this way

```
Outliner(".content",{
  hasNavMenu: true
})
```

The project is in a very early stage, I'm still making Outliner to work with jQuery, in the future you can you use Outliner like this

```
$(".content").outliner({
  hasNavMenu: true
})
```
