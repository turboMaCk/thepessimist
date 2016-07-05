// The MIT License (MIT)
// Copyright (c) 2016 Marek Fajkus

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import { NumberArgument as ErrorNumberArgument } from './errors';

function resolveShortcut (val : string, shortcuts?) : string[] {
    var arr : string[] = val.split('-');
    if (arr.length === 1) { return arr; }
    return ['', shortcuts[arr[1]]];
}

function parseOption <T> (value : any[], def : T) : T {
    return Array.isArray(def) ? value : value[0];
}

export default function pessimist <T> (def : T, argv : string[], shortcuts?) : T {
    var processedArgs = [];

    argv.forEach((val) => {
        var splited = val.split('--');
        splited = splited.length === 1 ? resolveShortcut(splited[0], shortcuts) : splited;

        if (splited.length > 1) {
            processedArgs.push({
                argument: splited[1],
                value: []
            });
        } else {
            if (processedArgs.length < 1) {
                return;
            }
            processedArgs[processedArgs.length - 1].value.push(splited[0]);
        }
    });

    let parsedArgs = {}
    processedArgs.forEach((arg) => {
        parsedArgs[arg.argument] = arg.value.length === 0 ? [true] : arg.value;
    });

    let settings : T = Object.create(def);
    Object.keys(def).forEach((option) => {
        if (typeof def[option] === 'number') {
            throw ErrorNumberArgument;
        }
        settings[option] = parsedArgs[option] ? parseOption(parsedArgs[option], def[option]) : def[option];
    });

    return settings;
}
