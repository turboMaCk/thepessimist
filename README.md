# ThePessimist

Light-weight UNIX style argv option parsing with depression. [Optimist](https://www.npmjs.com/package/optimist) alternative with purer white-list oriented API.

![Grumpy cat](http://campusriot.com/wp-content/uploads/2014/10/grumpycat.jpg)

## Why?

Parsing command line arguments is an essential part of many programs. Yet I haven't found any suitable existing library.
Using `process.argv` is not enough so everybody ends up writing some parsing layer on top of it.
[Optimist](https://www.npmjs.com/package/optimist) is now deprecated and its API is way too over complicated.
[Minimist](https://www.npmjs.com/package/minimist)'s API is also full of nonsense (e.g. `-abc` => `{ a: true, b: true, c: true }`).
More importantly the basic idea behind ThePessimist is it's using **defaults** as **whitelist** for passed arguments and forces you to keep convention of having full named version beginning with `--` and short one with `-`.
The idea is to be defensive to everything which comes from *the cruel outside world* and to bring conventios over unnecessary options.
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
  flag: false,
  list: ['one', 'two'],
  single: 'thing'
};

var shortcutMappings = {
  f: 'flag',
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
  flag: false,
  list: ['one', 'two'],
  single: 'hi'
}

node index.js -f -l just
{
  flag: false,
  list: ['just'],
  single: 'thing'
}

node index.js --flag --nonsense
{
  flag: true,
  list: ['one', 'two'],
  single: 'thing'
}
```

Pretty straight forward, don't you think?

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

Copyright (C) 2016 Marek Fajkus

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
