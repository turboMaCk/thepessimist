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

        const parsed2 = cliArgs('');
        const result2 = pessimist(def, parsed2);

        it('has correct keys', () => expect(Object.keys(result2)).toEqual(['onoff', 'list', 'single']));
        it('parse boolean', () => expect(result2.onoff).toBe(false));
        it('parse list', () => expect(result2.list).toEqual(['hello', 'word']));
        it('parse string', () => expect(result2.single).toEqual('here'));
    });

    describe('defensiveness', () => {
        const def = {
            numberopt: 1.0
        }

        const parsed = cliArgs('--numberopt 2');
        it('do not allow number in defaults', () => {
            expect(pessimist.bind(this, def, parsed)).toThrow();
        });
    })
});
