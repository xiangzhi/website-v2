const express = require('express')
const app = express()
const port = 3000

//serve static files
app.use(express.static('public'))

//start listening
app.listen(port, () => console.log(`local web server listening on port ${port}!`))