const fs   = require('fs')
const path = require('path')
const cite = require('citation-js')


file = fs.readFileSync(path.join(__dirname, 'res/papers.bib'), 'utf8')
let citeData = cite(file)
output = citeData.format('bibliography', {
    format: 'text',
    template: 'apa',
    nosort:true
})

console.log(output.split('\n'))