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
