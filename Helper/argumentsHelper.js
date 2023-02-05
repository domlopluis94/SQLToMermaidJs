'use strict';

module.exports = class ArgumentsHelper {

    static ExtractParamterts(argv) {
        let result = {};
        argv.forEach(function(val, index, array) {
            if (val.startsWith("--") && val.includes("=")) {
                result[val.split("--")[1].split("=")[0]] = val.split("=")[1];
            }
        });
        return result;
    }

    static isHelpCommand(argv) {
        let help = false;
        argv.forEach(function(val, index, array) {
            if (val.includes("-h") || val.includes("--h")) {
                help = true;
            }
        });
        return help;
    }
}