function login(req, res) {

    if(req.session.loggedin != true) {
        res.render('login/index');
    } else {
        res.redirect('/')
    }

    
}

function auth(req, res) {
    const data = req.body;
    
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuarios WHERE usuario = ?', [data.nombre], (err, userdata) => {
            if(userdata > 0) {
                userdata.forEach(element => {
                    if(data.clave === element.clave){
                        req.session.loggedin = true;
                        req.session.name = element.nombre;

                        res.redirect('/');
                    } else {
                        res.render('login/index', { error: 'La contraseña es incorrecta' });
                    }
                });
            } else {
                res.render('login/register', { error: 'El nombre de usuario no existe'});
            }
        })
    })
    
}

function register(req, res) {
    if(req.session.loggedin != true) {
        res.render('login/register');
    } else {
        res.redirect('/')
    }

    
}

function storeUser(req, res) {
    const data = req.body;
    
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuarios WHERE usuario = ?', [data.nombre], (err, userdata) => {
            if(userdata > 0) {
                res.render('login/register', { error: 'El nombre de usuario ya existe'});
            } else {
                req.getConnection((err, conn) => {
            conn.query('INSERT INTO usuarios SET ?', [data], (err, rows) => {

                req.session.loggedin = true;
                req.session.name = data.nombre;

            res.redirect('/');
        });
    });
            }
        })
    })
    
}

function logout(req, res) {
    if(req.session.loggedin == true) {
        req.session.destroy();
        
    } 
        res.redirect('/login');
    
}

module.exports = {
    login,
    register,
    storeUser,
    auth,
    logout,
}