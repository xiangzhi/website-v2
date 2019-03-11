const express = require('express')
const app = express()
const hbs = require('hbs')
const path = require('path')
const port = 3000


//register partials
hbs.registerPartials(path.join(__dirname, 'public/views/partials/'))


//set the view engine to ejs
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'public/views')) //set where to find the includes/views


//point no directory to the main page
app.get('/', function(req, res){
    res.render('index')
})

app.get('/research/:projectname', function(req, res){
    
    file_name = req.params.projectname
    res.render('research-projects/' + file_name)
    //console.log(req)
})

app.get('/papers/:papername', function(req, res){
    
    file_name = req.params.papername
    res.render('papers/' + file_name)
    //console.log(req)
})

app.get('/hri19', function(req,res){
    res.redirect('/papers/hri19-robot-transition')
})

//serve static files
app.use(express.static('public'))

//all other paths point to the main
// app.get('*', function(req, res){
//     res.redirect('/');
// })


//start listening
app.listen(port, () => console.log(`local web server listening on port ${port}!`))