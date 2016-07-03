// The MIT License (MIT)
// Copyright (c) 2016 Marek Fajkus

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

///<reference path="./support/jasmine.d.ts"/>
import cliArgs from './helpers/cli-args'
import pessimist from '../index';

describe('options parsing', () => {
    describe('basics for each type of value', () => {
        const def = {
            onoff: false,
            list: ['hello', 'word'],
            single: 'here'
        };
        const parsed = cliArgs('--onoff --list hi there --single overthere');
        const result = pessimist(def, parsed);

        it('has correct keys', () => expect(Object.keys(result)).toEqual(['onoff', 'list', 'single']));
        it('parse boolean', () => expect(result.onoff).toBe(true));
        it('parse list', () => expect(result.list).toEqual(['hi', 'there']));
        it('parse string', () => expect(result.single).toEqual('overthere'));
    });

    describe('respect defaults types', () => {
        const def = {
            list: ['hello', 'word'],
            single: 'here'
        };

        const parsed = cliArgs('--list one --single over there');
        const result = pessimist(def, parsed);

        it('has correct keys', () => expect(Object.keys(result)).toEqual(['list', 'single']));
        it('respect array option', () => expect(result.list).toEqual(['one']));
        it('respect string option', () => expect(result.single).toEqual('over'));
    });

    describe('use defaults if not passed', () => {
        const def = {
            onoff: false,
            list: ['hello', 'word'],
            single: 'here'
        };
        const parsed = cliArgs('');
        const result = pessimist(def, parsed);

        it('has correct keys', () => expect(Object.keys(result)).toEqual(['onoff', 'list', 'single']));
        it('parse boolean', () => expect(result.onoff).toBe(false));
        it('parse list', () => expect(result.list).toEqual(['hello', 'word']));
        it('parse string', () => expect(result.single).toEqual('here'));
    });

    describe('shotcuts', () => {
        const def = {
            onoff: false,
            list: ['hello', 'word'],
            single: 'here'
        };
        const shortcuts = {
            o: 'onoff',
            l: 'list',
            s: 'single'
        };
        const parsed = cliArgs('-o -l one two -s just');
        const result = pessimist(def, parsed, shortcuts);

        it('has correct keys', () => expect(Object.keys(result)).toEqual(['onoff', 'list', 'single']));
        it('correct boolean', () => expect(result.onoff).toBe(true));
        it('correct list', () => expect(result.list).toEqual(['one', 'two']))
        it('correct string', () => expect(result.single).toEqual('just'))
    });

    describe('break by mutability', () => {
        const def = {
            onoff: true,
            list: ['hello', 'word'],
            single: 'here'
        };
        const parsed = cliArgs('--onoff --list hi there --single overthere');
        const result = pessimist(def, parsed);

        it('has correct keys', () => expect(Object.keys(result)).toEqual(['onoff', 'list', 'single']));
        it('parse boolean', () => expect(result.onoff).toBe(false));
        it('parse list', () => expect(result.list).toEqual(['hi', 'there']));
        it('parse string', () => expect(result.single).toEqual('overthere'));

        const parsed2 = cliArgs('');
        const result2 = pessimist(def, parsed2);

        it('has correct keys', () => expect(Object.keys(result2)).toEqual(['onoff', 'list', 'single']));
        it('parse boolean', () => expect(result2.onoff).toBe(true));
        it('parse list', () => expect(result2.list).toEqual(['hello', 'word']));
        it('parse string', () => expect(result2.single).toEqual('here'));
    });

    describe('defensiveness', () => {
        it('do not allow number in defaults', () => {
            const def = {
                numberopt: 1.0
            }
            const parsed = cliArgs('--numberopt 2');
            expect(pessimist.bind(this, def, parsed)).toThrow();
        });

        it('dash to cammel calse', () => {
            const def = {
                someThing: false
            };
            const parsed = cliArgs('--some-thing');
            expect(pessimist(def, parsed).someThing).toEqual(true);
        });

        it('do not breaks when - is passed as value', () => {
            const def = {
                val: 'def'
            };
            const parsed = cliArgs('--val my-value');
            expect(pessimist(def, parsed).val).toEqual('my-value');
        });

        it('do not break when shortcuts do not exist', () => {
            const def = {
                val: 'def'
            };
            const parsed = cliArgs('-s value');
            expect(pessimist(def, parsed)).toEqual(def);
        })
    })
});
