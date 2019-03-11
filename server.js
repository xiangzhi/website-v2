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
    res.render('index',{title:"PhD Student"})
})

app.get('/research/:projectname', function(req, res){
    
    file_name = req.params.projectname
    title_name = file_name.split('-').join(' ')
    res.render('research-projects/' + file_name, {title:title_name})
    //console.log(req)
})

app.get('/papers/:papername', function(req, res){
    
    file_name = req.params.papername
    title_name = file_name.split('-').join(' ')
    res.render('papers/' + file_name, {title:title_name})
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