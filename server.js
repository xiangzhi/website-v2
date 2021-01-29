const express = require('express')
const app = express()
const hbs = require('hbs')
const path = require('path')
const yaml = require('js-yaml');
const fs   = require('fs');
const cite = require('citation-js')

const port = 3000

//register partials
hbs.registerPartials(path.join(__dirname, 'public/views/partials/'))

//set the view engine to ejs
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'public/views')) //set where to find the includes/views

// Read the news document onces to pre-vent constant loading
news = []
try {
  const doc = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'res/news.yaml'), 'utf8'));
  news = doc.news
} catch (e) {
  console.log(e);
}

// serve the news page
app.get('/news', function(req, res){
    res.render("news", {title: "News", news:news})
})

research_projects = {
    current:[],
    past:[]
}
try {
    const doc = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'res/research.yaml'), 'utf8'));
    research_projects = doc
  } catch (e) {
    console.log(e);
  }

  // serve the publication page
app.get('/research', function(req, res){
    data = {
        title:"Research",
        projects: research_projects
    }
    res.render("research", data)
})

const name_regex = /Tan, X. Z./gi
function ParsingCitation(file, prefix, class_name){
    fcite = cite(file)
    var text = fcite.format('bibliography', {
        format: 'text',
        template: 'apa',
        nosort: true
    })
    text = text.replace(name_regex, "<b>Tan, X. Z.</b>")
    var arr = text.split('\n')
    console.log(arr)
    arr.pop()
    var count = 1;
    for( var i = arr.length - 1; i >= 0 ; i--){
        arr[i] = "<p class='publication-item'><span class='" + class_name + "'>" + prefix + count + ". </span> " + arr[i] + "</p>"
        count++
    }
    return arr 
}

lbr_file = fs.readFileSync(path.join(__dirname, 'res/lbr.bib'), 'utf8')
lbr_text_arr = ParsingCitation(lbr_file, 'R', "badge badge-secondary")

const paper_yaml_doc = yaml.safeLoad(fs.readFileSync('res/papers.yaml', 'utf8'));
var paper_text_arr = []
console.log(paper_yaml_doc.papers.length)
paper_num = paper_yaml_doc.papers.length
for(var i = 0; i < paper_yaml_doc.papers.length; i++){
    html_text = "<div class='publication-item'><span class='badge badge-primary'>C" + 
        paper_num + ". </span> " + paper_yaml_doc.papers[i].name + "</br>"
    
    // If there are tags with the paper
    if ("tags" in paper_yaml_doc.papers[i])
    {
        paper_yaml_doc.papers[i].tags.forEach(tag => {
            if ("type" in tag && tag.type == "PDF")
            {
                html_text += "<img class='code-badge' alt='PDF Icon' src='resource/pdf.svg'>"
                html_text += "<a href='" + tag.link + "'> Paper </a>"
            }
            else
            {
                if ("icon" in tag){
                    html_text += "<img class='code-badge' alt='" + tag.icon_alt + "' src='"+ tag.icon + "'>"
                }
                code_text = "Link"
                if ("text" in tag){
                    code_text = tag.text
                }
                html_text += ("<a href='" + tag.link + "'> " + code_text + " </a>")
            }
        });
    }
    html_text += "</div>"
    paper_text_arr.push(html_text)
    paper_num--
}

// serve the publication page
app.get('/publications', function(req, res){
    data = {
        title:"Publications",
        full: paper_text_arr,
        report: lbr_text_arr
    }
    res.render("publications", data)
})

//point no directory to the main page
app.get('/', function(req, res){
    data = {
        title:"PhD Student",
        news: news.slice(0, 5),
        projects: research_projects.current
    }
    res.render('index', data)
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