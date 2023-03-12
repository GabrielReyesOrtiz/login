const express = require('express');  // Importa la librería Express
const { engine } = require('express-handlebars');  // Importa el motor de plantillas Handlebars
const myConnection = require('express-myconnection');  // Importa la librería express-myconnection
const bodyParser = require('body-parser');  // Importa la librería body-parser para procesar datos de formularios
const mysql = require('mysql');  // Importa el controlador de MySQL
const session = require('express-session');  // Importa la librería express-session para el manejo de sesiones
const loginRoutes = require('./routes/login')  // Importa el módulo de rutas de login

const app = express();  // Crea una instancia de la aplicación Express
app.set('port', 800);  // Establece el puerto en el que se ejecutará la aplicación

app.use(bodyParser.urlencoded({  // Agrega middleware para procesar datos de formularios
  extended: true
}));
app.use(bodyParser.json());

app.use(myConnection(mysql, {  // Agrega middleware para establecer la conexión con la base de datos
  host: 'localhost',
  user: 'root',
  password: '1234',
  port: 3306,
  database: 'dblogueo'
}, 'single'));

app.get('/verificar-conexion', (req, res) => {  // Ruta para verificar la conexión con la base de datos
  req.getConnection((err, connection) => {
    if (err) {
      console.error('Error de conexión a la base de datos:', err);
      res.send('Error de conexión a la base de datos');
    } else {
      console.log('Conexión a la base de datos establecida');
      res.send('Conexión a la base de datos establecida');
    }
  });
});

app.use(session({  // Agrega middleware para el manejo de sesiones
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.set('views', __dirname + '/views');  // Establece la carpeta donde se encuentran las vistas
app.engine('.hbs', engine({  // Configura el motor de plantillas Handlebars
  extname: '.hbs',
}));
app.set('view engine', 'hbs');  // Establece el motor de plantillas predeterminado

app.listen(app.get('port'), () => {  // Inicia la aplicación en el puerto especificado
  console.log('Listening on port ', app.get('port'));
});

app.use('/', loginRoutes);  // Agrega las rutas de login

app.get('/', (req, res) => {  // Ruta para la página principal
  if(req.session.loggedin != true) {  // Verifica si el usuario ha iniciado sesión
    res.render('home', { name: req.session.name });  // Si no ha iniciado sesión, muestra la página de inicio
} else {
    res.redirect('/login')  // Si ha iniciado sesión, redirige a la página de login
}
});