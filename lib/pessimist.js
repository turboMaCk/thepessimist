"use strict";
var errors_1 = require('./errors');
function resolveShortcut(val, shortcuts) {
    var arr = val.split('-');
    if (arr.length === 1) {
        return arr;
    }
    return ['', shortcuts[arr[1]]];
}
function parseOption(value, def) {
    return Array.isArray(def) ? value : value[0];
}
function pessimist(def, argv, shortcuts) {
    var processedArgs = [];
    argv.forEach(function (val) {
        var splited = val.split('--');
        splited = splited.length === 1 ? resolveShortcut(splited[0], shortcuts) : splited;
        if (splited.length > 1) {
            processedArgs.push({
                argument: splited[1],
                value: []
            });
        }
        else {
            if (processedArgs.length < 1) {
                return;
            }
            processedArgs[processedArgs.length - 1].value.push(splited[0]);
        }
    });
    var parsedArgs = {};
    processedArgs.forEach(function (arg) {
        parsedArgs[arg.argument] = arg.value.length === 0 ? [true] : arg.value;
    });
    var settings = Object.create(def);
    Object.keys(def).forEach(function (option) {
        if (typeof def[option] === 'number') {
            throw errors_1.NumberArgument;
        }
        settings[option] = parsedArgs[option] ? parseOption(parsedArgs[option], def[option]) : def[option];
    });
    return settings;
}
exports.__esModule = true;
exports["default"] = pessimist;
