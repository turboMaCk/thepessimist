# ThePessimist

[![Build Status](https://travis-ci.org/turboMaCk/thepessimist.svg?branch=master)](https://travis-ci.org/turboMaCk/thepessimist)

Light-weight UNIX style argv option parsing with depression. [Optimist](https://www.npmjs.com/package/optimist) alternative with purer white-list oriented API.

![Grumpy cat](http://campusriot.com/wp-content/uploads/2014/10/grumpycat.jpg)

## Why?

Parsing command line arguments is an essential part of many programs. Yet I haven't found any suitable existing library.
Using `process.argv` is not enough so everybody ends up writing some parsing layer on top of it.
[Optimist](https://www.npmjs.com/package/optimist) is now deprecated and its API is way too over complicated.
[Minimist](https://www.npmjs.com/package/minimist)'s API is hard to work with since it parse types dynamically.
More importantly the basic idea behind ThePessimist is it's using **defaults** as **whitelist** for passed arguments and forces you to keep convention of having full named version beginning with `--` and short one with `-`.
The idea is to be defensive to everything which comes from *the cruel outside world* and to bring conventions over unnecessary options.
**White-listing by defaults** makes it also much easier to reason about values you're passing around your application.

[![ScreenShot](http://img.youtube.com/vi/27nNSocP7Dc/0.jpg))](https://www.youtube.com/watch?v=27nNSocP7Dc)

## Instalation

As you expected:

```
npm install --save thepessimsit
```

## Example

Open your favorite Emacs and create simple `index.js` file

```javascript
var thePessimist = require('thepessimist').default;

var defaultValues = {
  positive: false,
  negative: true,
  list: ['one', 'two'],
  single: 'thing'
};

var shortcutMappings = {
  p: 'positive',
  l: 'list',
  s: 'single'
};

var settings = thePessimist(defaultValues, process.argv, shortcutMappings);

console.log(settings);
```

then from your terminal you can play with settings:

```
node index.js --single hi
{
  positive: false,
  negative: true,
  list: ['one', 'two'],
  single: 'hi'
}

node index.js -p --negative -l just
{
  positive: true,
  negative: false,
  list: ['just'],
  single: 'thing'
}

node index.js --positive --nonsense
{
  positive: true,
  negative: true,
  list: ['one', 'two'],
  single: 'thing'
}
```

Pretty straight forward, don't you think?

**See that types are garantees to stay same as in defaults. All extra arguments are not accepted which adds some extra security.**

### Supported Options Types

There are three types of options supported - booleans, stringsa and Arrays of strungs.

#### Booleans (Toggables)

Boolean values have no any parameters. You can define default value to both `true` or `false`. Passig that option from terminal then toggle its value (`true => false` or `false => true`).

### Strings

Single string value like `single: 'b'`. If value with spaces is passed as arg, this value will become string with spaces `--single with space` => `{ single: 'with space'}`.
If value is not passed like `--single` value becomes `undefined`.

### Arrays of strings

If default value is string, spaces passed from cmd are used as separator for items like `--arr one two 3` => `{ arr: ['one', 'two', '3'] }`.
If value is not pased, it's parsed as empty array like `--arr` => `{ arr: [] }`.

## Limitations

I've decided to not support numeric values parsing. Numbers are always parsed as string so you can always handle retyping by yourself.
If you try to pass defaults object containing numeric value it throws an exception. This means you have to define numbers as string also in defaults and deal with retyping later.

## Development

Source code is written in Typescript to make it easier for people who want to use this with typescript.
Anyway you do not have to has typescript globally installed in order to be able to compile this project by yourself.

First install all dependencies:
```
npm install
```

then you're able run tests:
```
npm test
```
doing so should not create any diff in git besides your changes in ts files

If you want to create new build just run:
```
npm run build
```

This will compile JavaScript files from typescript.

## License

The MIT License (MIT)
Copyright (c) 2016 Marek Fajkus

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
