# @jzendo/babel-plugin-transform-template-literals

## Support `stripForeAndAftLinebreaks` option

```javascript

stripForeAndAftLinebreaks:
  "none"    // None
  "all"     // Strip all fore-and-aft /^[\n|\t|\s]+|[\n|\t|\s]+$/
  "default" // Strip only one fore-and-aft /^[\n]|[\n]$/

```

## `babel.config.js/.babelrc` configuration

```javascript
{
  plugins: [
    [
      require('@jzendo/babel-plugin-transform-template-literals'),
      {
        // ['none', 'default', 'all'], default: 'default'
        stripForeAndAftLinebreaks: 'none'
      }
    ]
  ]
}
```

## Samples

**stripForeAndAftLinebreaks**: none

```javascript
/** ES6 */
let a = `

abc
`

/** ES5 */
var a = '\n\nabc\n'

```

**stripForeAndAftLinebreaks**: default

```javascript
/** ES6 */
let a = `

abc
`

/** ES5 */
var a = '\nabc'

```

**stripForeAndAftLinebreaks**: all

```javascript
/** ES6 */
let a = `

abc
`

/** ES5 */
var a = 'abc'

```

## Using plugin

```sh
npm install -D @jzendo/babel-plugin-transform-template-literals
```

or

```sh
yarn add -D @jzendo/babel-plugin-transform-template-literals
```

Fork: <https://github.com/babel/babel/tree/v7.8.6/packages/babel-plugin-transform-template-literals>

>
> ## @babel/plugin-transform-template-literals
>
> Compile ES2015 template literals to ES5
>
> See our website [@babel/plugin-transform-template-literals](https://babeljs.io/docs/en/next/babel-plugin-transform-template-literals.html) for more information.
>
> ### Install
>
> Using npm:
>
> ```sh
> npm install --save-dev @babel/plugin-transform-template-literals
> ```
>
> or using yarn:
>
> ```sh
> yarn add @babel/plugin-transform-template-literals --dev
> ```
>
