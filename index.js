const SqlToMermaid = require("./Manager/sqlToMermaid.js");
const sqlToMermaid = new SqlToMermaid(process.argv);
sqlToMermaid.process();