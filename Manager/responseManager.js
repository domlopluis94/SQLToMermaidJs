'use strict';
const chalk = require("chalk");

module.exports = class ResponseManager {

    static Info(text) {
        console.log(chalk.default.white(text));
    }

    static HelpCommand() {
        console.log(chalk.default.green(`Usage: --input=<filename>.sql --out=<filename>.md --mode=classDiagram

            Options:
            --help      Show help                                                [boolean]
            --input     SQL File name                                            [String] [required]
            --out       Out Put file name                                        [string]
            --mode      Mermaid Mode                                             [classDiagram|stateDiagram]
        `));
    }

    static Error(text) {
        console.log(chalk.default.red(text));
    }
}