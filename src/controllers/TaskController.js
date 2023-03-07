const CryptoJS = require("crypto-js");
const connection = require("express-myconnection");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const express = require('express');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

function index(req, res) {
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM tasks', (err, tasks) => {
      if(err) {
        res.json(err);
      }
      res.render('tasks/index', { tasks });
    });
  });
}

function create(req, res) { //GET

  res.render('tasks/create');
}

function store(req, res) { //POS
  const {usuario, contraseña} = req.body;
  //console.log(data);
  //const contraseña = data.description;
    
  const md5Contraseña = CryptoJS.MD5(contraseña).toString();
  console.log(md5Contraseña);

  connection.query(
    'SELECT * FROM usuarios WHERE usuario = ?',
    [usuario],
    (err, results) => {
      if (err) {
        console.error('Error al consultar el usuario en la base de datos: ', err);
        res.status(500).send('Error interno del servidor');
      } else if (results.length === 0) {
        //El usuario no existe en la base de datos
        res.status(401).send('El usuario o la contraseña son incorrectos');
      } else {
        const usuario = results[0];
        bcrypt.compare(contraseña, usuario.contraseña, (err, result) => {
          if(err) {
            console.error('Error al comaprar las contraseñas: ', err);
            res.status(500).send('Error interno del servidor');
          } else if (result === false) {
            //Contraseña incorrecta
            res.status(401).send('El usuario o la contraseña son incorrectos');
          } else {
            //La contraseña es correcta
            res.send('Inicio de sesión exitoso');
          }
        })
      }
    }
  )
  
  //data.description = md5Cadena;
  //console.log(data)
  
 // req.getConnection((err, conn) => {
   // conn.query('INSERT INTO tasks SET ?', [data], (err, rows) => {
     // res.redirect('/tasks');
      //});
    //});
  }

//function store(req, res) { //POS
//  const data = req.body;
//  console.log(data);
//  const contraseña = data.description;
  
//  const md5Cadena = CryptoJS.MD5(contraseña).toString();
//  console.log(md5Cadena);

//  data.description = md5Cadena;
//  console.log(data)

//req.getConnection((err, conn) => {
//    conn.query('INSERT INTO tasks SET ?', [data], (err, rows) => {
//      res.redirect('/tasks');
//    });
//  });
//}

function destroy(req, res) {
  const id = req.body.id;

  req.getConnection((err, conn) => {
    conn.query('DELETE FROM tasks WHERE id = ?', [id], (err, rows) => {
      res.redirect('/tasks');
    });
  })
}

function edit(req, res) {
  const id = req.params.id;

  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM tasks WHERE id = ?', [id], (err, tasks) => {
      if(err) {
        res.json(err);
      }
      res.render('tasks/edit', { tasks });
    });
  });
}

function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  req.getConnection((err, conn) => {
    conn.query('UPDATE tasks SET ? WHERE id = ?', [data, id], (err, rows) => {
      res.redirect('/tasks');
    });
  });
}


module.exports = {
  index: index,
  create: create,
  store: store,
  destroy: destroy,
  edit: edit,
  update: update,
}