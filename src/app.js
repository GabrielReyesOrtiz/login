const express = require('express');
const { engine } = require('express-handlebars');
const myConnection = require('express-myconnection');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const loginRoutes = require('./routes/login')

const app = express();
app.set('port', 80);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(myConnection(mysql, {
  host: 'localhost',
  user: 'root',
  password: '1234',
  port: 3306,
  database: 'dblogueo'
}, 'single'));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.set('views', __dirname + '/views');
app.engine('.hbs', engine({
  extname: '.hbs',
}));
app.set('view engine', 'hbs');


app.listen(app.get('port'), () => {
  console.log('Listening on port ', app.get('port'));
});

app.use('/', loginRoutes);

app.get('/', (req, res) => {
  if(req.session.loggedin != true) {
    res.render('home', { name: req.session.name });
} else {
    res.redirect('/login')
}
});