'use strict';
const ArgumentsHelper = require("./../Helper/argumentsHelper.js");
const ResponseManager = require("./responseManager.js");
const FS = require("fs");


module.exports = class SqlToMermaid {

    constructor(argv) {
        if (!ArgumentsHelper.isHelpCommand(argv)) {
            this.args = ArgumentsHelper.ExtractParamterts(argv);
        } else {
            this.args = null;
        }

        this.outputMd = null;
        this.job = {};

        this.sql = {}

        this.mermaid = {};
    }

    validateParameters() {
        //input
        if (this.args["input"] != undefined && typeof(this.args["input"]) == "string" && this.args["input"].split(".")[1] == "sql") {
            try {
                this.job["sql"] = this.readFile(this.args["input"]);
            } catch (error) {
                ResponseManager.Error(`File Not Found ${this.args["input"]} \n ${error}`);
            }

        } else {
            ResponseManager.Error("--input argument is mandatory (it only accept sql files)")
        }

        //out
        if (this.args["out"] != undefined && typeof(this.args["out"]) == String && this.args["out"].split(".")[1] == "md") {
            this.job["mdName"] = this.args["out"];
        } else {
            this.job["mdName"] = "output_readme.md";
        }

        //mode
        switch (this.args["mode"]) {
            case "stateDiagram":
                this.job["mode"] = "stateDiagram"
            case "classDiagram":
            default:
                this.job["mode"] = "classDiagram";
        }

    }

    readFile(fileName) {
        const buffer = FS.readFileSync(fileName);
        return buffer.toString();
    }

    process() {
        this.validateParameters();
        this.extractSqlDataToJson();
    }

    extractSqlDataToJson() {
        let $this = this;
        let names = this.getClassNames();

        names.forEach((element) => {
            $this.sql[element] = $this.getProperties(element);
        })
        this.addRelateds();
        this.toMermaid();
        this.writeMermaid();
    }

    getClassNames() {
        const regex = /CREATE TABLE (\w+) /gm;
        let match = this.job["sql"].match(regex);
        let sqlClass = [];
        let i = 0;
        match.forEach(element => {
            sqlClass[i] = element.split("CREATE TABLE ")[1].replace(/\s+/g, '');
            i++;
        });

        return sqlClass;
    }

    getProperties(className) {
        const regex = new RegExp(`CREATE TABLE ${className} \\(([^;]*)\\)`, 'gm');
        let classsql = this.job["sql"].match(regex);
        const regex2 = /\(([^;]*)\)/gm;
        const regex3 = /\w+ \w+[^,(]/gm;
        let classsqlprop = classsql[0].match(regex2)[0].match(regex3);
        let sqlClass = {};
        classsqlprop.forEach(element => {
            sqlClass[element.split(" ")[0]] = element.split(" ")[1];
        });
        return sqlClass;
    }

    addRelateds() {
        let $this = this;
        for (const key in $this.sql) {
            $this.sql[key]["Relateds"] = $this.getRelateds(key, $this);
        }
    }

    getRelateds(className, $this) {
        let relateds = {};
        for (const key in $this.sql) {
            if (key != className) {
                for (const propertie in $this.sql[key]) {
                    if (className == propertie || `id${className.toLowerCase()}` == propertie.toLowerCase() || `${className.toLowerCase()}id` == propertie.toLowerCase()) {
                        relateds[key] = propertie;
                    }
                }
            }
        }
        return relateds;
    }

    toMermaid() {
        let $this = this;
        switch (this.job["mode"]) {
            case "stateDiagram":
                $this.toMermaidstateDiagram($this)
            case "classDiagram":
            default:
                $this.toMermaidclassDiagram($this)
        }
    }

    toMermaidstateDiagram($this) {}

    toMermaidclassDiagram($this) {
        $this.classmixedDiagram($this);
        $this.classIndividualDiagram($this);
    }

    classmixedDiagram($this) {
        $this.mermaid["Mixed"] = "classDiagram \n"
        for (const key in $this.sql) {
            $this.mermaid["Mixed"] += $this.objectToClassDiagram(key, $this.sql[key]);
        }
    }

    classIndividualDiagram($this) {
        for (const key in $this.sql) {
            $this.mermaid[key] = "classDiagram \n"
            $this.mermaid[key] += $this.objectToClassDiagram(key, $this.sql[key]);
        }
    }

    objectToClassDiagram(className, properties) {
        let mermaid = "";
        if (properties.Relateds != {}) {
            for (const key in properties.Relateds) {
                mermaid += `${className} <|-- ${key} : ${properties.Relateds[key]} \n`;
            }
        } else {
            mermaid += `class ${className} \n`;
        }

        if (mermaid == "") {
            mermaid += `class ${className} \n`;
        }

        for (const key in properties) {
            if (key != "Relateds") {
                mermaid += `${className} : ${properties[key]} ${key}  \n`;
            }
        }

        return mermaid;
    }

    writeMermaid() {
        let md = "# SQL TO MERMAID \n";
        for (const key in this.mermaid) {
            md += "## " + key + " \n ```mermaid \n";
            md += this.mermaid[key];
            md += "``` \n";
        }
        FS.writeFileSync(`./${this.job.mdName}`, md);
    }
}