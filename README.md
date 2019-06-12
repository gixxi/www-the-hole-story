# www-the-hole-story
Website for the hole story

## DevOps

Fetching the dependecies

> npm install -D babel-loader @babel/core @babel/preset-env webpack
> npm install --save-dev babel-plugin-transform-react-jsx
> npm install --save-dev webpack-cli

The I touched a .babelrc pointing to mithril as static vdom differ

```
{
  "plugins": [
    ["transform-react-jsx", {
      "pragma": "m" // default pragma is mithril
    }]
  ]
}
```

## Building

Continuous build

npm start

Less -> CSS

make less
