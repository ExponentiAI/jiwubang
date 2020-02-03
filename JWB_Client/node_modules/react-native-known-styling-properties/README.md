# React Native styling properties

[![NPM version](https://img.shields.io/npm/v/react-native-known-styling-properties.svg)](https://www.npmjs.com/package/react-native-known-styling-properties)
[![Build Status](https://travis-ci.org/kristerkari/react-native-known-styling-properties.svg?branch=master)](https://travis-ci.org/kristerkari/react-native-known-styling-properties)
[![Build status](https://ci.appveyor.com/api/projects/status/4upf25j0k8d866s0/branch/master?svg=true)](https://ci.appveyor.com/project/kristerkari/react-native-known-styling-properties/branch/master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

List of known React Native specific styling properties.

Sources for supported properties:

* [React Native documentation](https://facebook.github.io/react-native/docs/layout-props.html)
* [react-native-styling-cheat-sheet](https://github.com/vhpoet/react-native-styling-cheat-sheet)
* [css-to-react-native tests](https://github.com/styled-components/css-to-react-native/tree/master/src/__tests__)

## Install

```sh
yarn add react-native-known-styling-properties --dev
```

or

```sh
npm install react-native-known-styling-properties --save-dev
```

## API

To get list of all styling properties supported by React Native:

```js
import { allProps } from "react-native-known-styling-properties";
```

To get list of all styling properties supported by [css-to-react-native](https://github.com/styled-components/css-to-react-native):

```js
import { allCSS2RNProps } from "react-native-known-styling-properties";
```

The result is an array of supported styling properties:

```js
allProps = [
  "alignItems",
  "alignSelf",
  "flex",
  "flexDirection",
  "flexWrap",
  ...
]
```
