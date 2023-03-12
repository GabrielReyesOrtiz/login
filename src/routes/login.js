const express = require('express');  // Importa el módulo Express.js
const LoginController = require('../controllers/LoginController');  // Importa el controlador LoginController que se encargará de manejar las peticiones relacionadas con la autenticación.


const router = express.Router();  // Crea un objeto Router que se utilizará para definir las rutas de la aplicación.

// Define la ruta /login y especifica que cuando se reciba una petición GET en esta ruta, se llame al método login del controlador LoginController.
router.get('/login', LoginController.login);

// Define la ruta /login y especifica que cuando se reciba una petición POST en esta ruta, se llame al método auth del controlador LoginController.
router.post('/login', LoginController.auth);

// Define la ruta /register y especifica que cuando se reciba una petición GET en esta ruta, se llame al método register del controlador LoginController.
router.get('/register', LoginController.register);

// Define la ruta /register y especifica que cuando se reciba una petición POST en esta ruta, se llame al método storeUser del controlador LoginController.
router.post('/register', LoginController.storeUser);

// Define la ruta /logout y especifica que cuando se reciba una petición GET en esta ruta, se llame al método logout del controlador LoginController.
router.get('/logout', LoginController.logout);

module.exports = router;  // Exporta el objeto router para que pueda ser utilizado en otros archivos de la aplicación.