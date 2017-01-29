var express = require('express');
var cookieSession = require('cookie-session');
var morgan = require('morgan'); // Charge le middleware de logging
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

app.set('trust proxy', 1); // trust first proxy

app.use(cookieSession({
    name: 'session',
    secret: 'todolistsecretkey'
}));

app.use(morgan('combined')); // Active le middleware de logging

/* S'il n'y a pas de todolist dans la session,
 on en crée une vide sous forme d'array avant la suite */
app.use(function(req, res, next){
    if (typeof(req.session.todo_list) == 'undefined') {
        req.session.todo_list = [];
    }
    next();
});

app.get('/todo', function(req, res) {
    res.render('todoList.ejs', {todolist: req.session.todo_list});
})
/* On ajoute un élément à la todolist */
.post('/todo/ajouter/', urlencodedParser, function(req, res) {
    if (req.body.newtodo != '') {
        req.session.todo_list.push(req.body.newtodo);
    }
    res.redirect('/todo');
})

/* Supprime un élément de la todolist */
    .get('/todo/supprimer/:id', function(req, res) {
        if (req.params.id != '') {
            req.session.todo_list.splice(req.params.id, 1);
        }
        res.redirect('/todo');
    });


app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

app.listen(8080);