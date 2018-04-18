[![Build Status](https://travis-ci.org/sanchitanand/babel-plugin-transform-jquery.png?branch=master)](https://travis-ci.org/sanchitanand/babel-plugin-transform-jquery)

[![https://nodei.co/npm/babel-plugin-transform-jquery.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/babel-plugin-transform-jquery.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/babel-plugin-transform-jquery)


Babel Plugin that converts jQuery code into vanilla JS.


## Installation

```sh
npm install --save-dev babel-plugin-transform-jquery
```

## Usage

### Via `.babelrc`

**.babelrc**

```json
{
  "plugins": ["babel-plugin-transform-jquery"]
}
```

### Via CLI

```sh
babel --plugins babel-plugin-transform-jquery script.js
```

### Via Node API

```javascript
require("@babel/core").transform("code", {
  plugins: ["babel-plugin-transform-jquery"]
});
```

###Currently Support properties

- text()
- css()
- click()
- on()

