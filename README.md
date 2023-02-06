# SQLToMermaidJs
Convert your SQL to Mermaid quickly, simply reference your SQL file and you will get your complete MD file.

## Arguments
```bash
Usage: --input=<filename>.sql --output=<filename>.md --mode=classDiagram --mermaidmd=quotes

            Options:
            --help      Show help                                                [boolean]
            --input     SQL File name                                            [string] [required]
            --output       Out Put file name                                     [string]
            --mode      Mermaid Mode                                             [classDiagram|stateDiagram]
            --mermaidmd MD Mermaid quotes                                        [quotes|points]
```

## Usage 

```bash
node ./index.js --input=mermaid.sql --output=mermaid.md --mode=classDiagram --mermaidmd=points
```
