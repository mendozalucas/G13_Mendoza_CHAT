/*  Paquetes instalados: -g nodemon, express, express-handlebars, body-parser, mysql2
    Agregado al archivo "package.json" la línea --> "start": "nodemon index"
    
    Proyecto "Node_base"
    Desarrollo de Aplicaciones Informáticas - 5to Informática
    
    Docentes: Nicolás Facón, Martín Rivas
    
    Revisión 1 - Año 2021
*/
//Cargo librerías instaladas y necesarias
const express = require('express'); //Para el manejo del servidor Web
const exphbs  = require('express-handlebars'); //Para el manejo de los HTML
const bodyParser = require('body-parser'); //Para el manejo de los strings JSON
const MySQL = require('./modulos/mysql'); //Añado el archivo mysql.js presente en la carpeta módulos
var palabra_anterior = ""

var palabra_incognita = ""
var palabra_juego = "";
const app = express(); //Inicializo express para el manejo de las peticiones// ...


// Middleware para servir archivos estáticos
app.use(express.static('/Node_base/public/js/Wordle.js'));


app.use(express.static('public')); //Expongo al lado cliente la carpeta "public"

app.use(bodyParser.urlencoded({ extended: false })); //Inicializo el parser JSON
app.use(bodyParser.json());

app.engine('handlebars', exphbs({defaultLayout: 'main'})); //Inicializo Handlebars. Utilizo como base el layout "Main".
app.set('view engine', 'handlebars'); //Inicializo Handlebars

const Listen_Port = 3000; //Puerto por el que estoy ejecutando la página Web

app.listen(Listen_Port, function() {
    console.log('Servidor NodeJS corriendo en http://localhost:' + Listen_Port + '/');
});

/*
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
*/
app.get('/', function(req, res)
{
    //Petición GET con URL = "/", lease, página principal.
    console.log(req.query); //En req.query vamos a obtener el objeto con los parámetros enviados desde el frontend por método GE
    
    res.render('login', {aviso: " "}); //Renderizo página "login" sin pasar ningún objeto a Handlebars
});

app.get('/login', function(req, res)
{
    //Petición GET con URL = "/", lease, página principal.
    console.log(req.query); //En req.query vamos a obtener el objeto con los parámetros enviados desde el frontend por método GET
    res.render('login', {aviso: " "}); //Renderizo página "login" sin pasar ningún objeto a Handlebars
});

app.put('/login', async function(req, res) {
    //Petición PUT con URL = "/login"
    console.log("Soy un pedido PUT", req.body); //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método PUT
    //Consulto en la bdd de la existencia del usuario
    let respuesta = await MySQL.realizarQuery(`SELECT * FROM  Users_Passwords  WHERE usuario = "${req.body.user}" AND contraseña = "${req.body.pass}"`)
    //Chequeo el largo del vector a ver si tiene datos
    if (respuesta.length > 0) {
        //Armo un objeto para responder
        console.log("true");
        res.send({validar: true})    
    }
    else{
        console.log("false");
        res.send({validar:false})    
    }
    
    
});

app.delete('/login', function(req, res) {
    //Petición DELETE con URL = "/login"
    console.log("Soy un pedido DELETE", req.body); //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método DELETE
    res.send(null);
});

app.post('/login', async function(req, res)
{
    let usuario = req.body.usuario_login;;
    console.log("Soy un pedido POST", req.body); 
    if(usuario=="admin"){
        res.render('administracion', null); 
    }else if(usuario=="puntaje"){
        res.render('tabla_puntuaciones', null); //modificado
    }
    else{
        res.render('wordle', {fullname: req.query.usuario_login});
    }    
});
//gfggdfgfdjmjhjhmj
app.get('/sign_up', function(req, res)
{
    //Petición GET con URL = "/sign_up"
    console.log("se esta logeando alguien!", req.query); 
    //En req.query vamos a obtener el objeto con los parámetros enviados desde el frontend por método GET
    res.render('sign_up',null); 

});

app.get('/reiniciar_juego', function(req, res)
{
    //Petición GET con URL = "/sign_up"
    console.log("reinicio!", req.query); 
    //En req.query vamos a obtener el objeto con los parámetros enviados desde el frontend por método GET
    res.render('wordle',null); 

});

app.post('/sign_up', async function(req, res)
{
    console.log("se esta logeando alguien!!", req.body); 
    //En req.query vamos a obtener el objeto con los parámetros enviados desde el frontend por método GET

    let user = req.body.usuarioID;
    let password = req.body.passwordID;
    let mail = req.body.mail;

    console.log("usuario: "+user);
    console.log("clave: "+password);
    let vector_pass = await MySQL.realizarQuery(`SELECT * FROM Users_Passwords WHERE usuario = "${user}"`)
    console.log(vector_pass);
    let existe = false

    for (let k = 0; k < vector_pass.length ;k++){
        if (user == vector_pass[k].usuario){ 
            existe = true
        } 
    }
    
    if (existe == false){

        MySQL.realizarQuery(`
        INSERT INTO Users_Passwords (usuario, contraseña, gmail )
        VALUES ("${user}", "${password}", "${mail}"); `)
        
        res.render('login', {aviso: "Usuario Creado con exito \r\n Ingrese su usuario"});
    }else if (existe == true){
        res.render('sign_up', {aviso_signup: "El usuario ya existe"});
    }
     //Renderizo página "home" sin pasar ningún objeto a Handlebars
    
});


//app.put('/verificar_palabra', async function(req, res) {

app.post('/verificar_palabra', async function(req, res) {
    /*console.log("Soy un pedido GET VERIFICAR PALABRA", req.body.cubo_1);*/
    console.log("palabra incognita 2: "+palabra_incognita)    
});

app.post('/push_puntos', async function(req, res) {
    puntos = req.data
    MySQL.realizarQuery(` 
    INSERT INTO Puntos (puntos, id_usuarios, nombre_usu)
    VALUES (${req.data.puntos},${req.data.id_usuarios}, ${req.data.nombre_usu})
    `)
    
    existe_  = MySQL.realizarQuery(`
        SELECT nombre_usu
        FROM Puntos
        WHERE nombre_usu LIKE "${req.data.nombre_usu}";
    `)

    if (existe > 0 ) {
        res.send({resultado: 1})
    }else {
        res.send({resultado: -1})
    }
});

app.put('/admin_usuarios', async function(req, res) {
    console.log("Soy un pedido PUT", req.body); //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método PUT
    let usuarios= await MySQL.realizarQuery(`SELECT * FROM  Users_Passwords;`)
    //Chequeo el largo del vector a ver si tiene datos
    if (usuarios.length > 0) {
        //Armo un objeto para responder
        console.log("true");
        res.send({validar: true, respuesta: {usuarios}})    
    }
    else{
        console.log("false");
        res.send({validar:false})    
    }   
});

app.delete('/delete_usuario', async function(req, res) {
    //Petición DELETE con URL = "/delete_usuario"
    console.log("Soy un pedido DELETE", req.body); //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método DELETE
    let puntajes_borrados= await MySQL.realizarQuery(`DELETE FROM Puntajes WHERE id_user="${req.body.idUsuario}";`)
    let usuario_borrado= await MySQL.realizarQuery(`DELETE FROM Users_Passwords WHERE ID="${req.body.idUsuario}";`)
    let usuarios= await MySQL.realizarQuery(`SELECT * FROM  Users_Passwords;`)
    //Chequeo el largo del vector a ver si tiene datos
    if (usuarios.length > 0) {
        //Armo un objeto para responder
        console.log("true");
        res.send({validar: true, respuesta: {usuarios}})    
    }
    else{
        console.log("false");
        res.send({validar:false})    
    }   
});

app.put('/get_puntajes', async function(req, res) {
    console.log("Soy un pedido PUT", req.body); //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método PUT
    let puntajes= await MySQL.realizarQuery(`SELECT * FROM  Puntajes WHERE id_user="${req.body.idUsuario}";`)
    //Chequeo el largo del vector a ver si tiene datos
    if (puntajes.length > 0) {
        //Armo un objeto para responder
        console.log("true");
        res.send({validar: true, respuesta: {puntajes}})    
    }
    else{
        console.log("false");
        res.send({validar:false})    
    }   
});

app.delete('/delete_puntaje', async function(req, res) {
    //Petición DELETE con URL = "/delete_puntaje"
    console.log("Soy un pedido DELETE", req.body); //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método DELETE
    let puntaje_borrado= await MySQL.realizarQuery(`DELETE FROM Puntajes WHERE id="${req.body.idPuntaje}";`)
    let puntajes= await MySQL.realizarQuery(`SELECT * FROM Puntajes WHERE id_user="${req.body.idUsuario}";`)
    //Chequeo el largo del vector a ver si tiene datos
    if (puntajes.length > 0) {
        //Armo un objeto para responder
        console.log("true");
        res.send({validar: true, respuesta: {puntajes}})    
    }
    else{
        console.log("false");
        res.send({validar:false})    
    }   
});

app.put('/admin_palabras', async function(req, res) {
    console.log("Soy un pedido PUT", req.body); //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método PUT
    let palabras= await MySQL.realizarQuery(`SELECT * FROM  palabras;`)
    //Chequeo el largo del vector a ver si tiene datos
    if (palabras.length > 0) {
        //Armo un objeto para responder
        console.log("true");
        res.send({validar: true, respuesta: {palabras}})    
    }
    else{
        console.log("false");
        res.send({validar:false})    
    }   
});

app.delete('/delete_palabra', async function(req, res) {
    console.log("Soy un pedido DELETE", req.body); //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método DELETE
    let palabra_borrada= await MySQL.realizarQuery(`DELETE FROM palabras WHERE palabra="${req.body.idPalabra}";`)
    let palabras= await MySQL.realizarQuery(`SELECT * FROM  palabras;`)
    //Chequeo el largo del vector a ver si tiene datos
    if (palabras.length > 0) {
        //Armo un objeto para responder
        console.log("true");
        res.send({validar: true, respuesta: {palabras}})    
    }
    else{
        console.log("false");
        res.send({validar:false})    
    }   
});

app.put('/insert_palabra', async function(req, res) {
    console.log("Soy un pedido PUT", req.body); //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método PUT
    let palabra_nueva= await MySQL.realizarQuery(`INSERT INTO palabras (palabra, dificultad) VALUES ("${req.body.palabra}", "${req.body.dificultad}"); `)
    let palabras= await MySQL.realizarQuery(`SELECT * FROM  palabras;`)
    //Chequeo el largo del vector a ver si tiene datos
    if (palabras.length > 0) {
        //Armo un objeto para responder
        console.log("true");
        res.send({validar: true, respuesta: {palabras}})    
    }
    else{
        console.log("false");
        res.send({validar:false})    
    }   
});
/*
app.put('/insert_puntaje', async function(req, res) {
    console.log("Soy un pedido PUT", req.body); //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método PUT
    await MySQL.realizarQuery(`INSERT INTO Puntajes (user_id, palabra, puntaje) VALUES ("${req.body.idUser}","${req.body.word}", "${req.body.score}"); `)
    console.log("insert true");
    res.render('wordle'); 
    res.send({validar: true});     
});
*/

app.put('/tabla_puntuaciones', async function(req, res) {
    console.log("Soy un pedido PUT", req.body); //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método PUT

    let tabla_puntuaciones = await MySQL.realizarQuery(`SELECT * FROM  Puntos;`)

    //Chequeo el largo del vector a ver si tiene datos
    if (tabla_puntuaciones.length > 0) {
        //Armo un objeto para responder
        console.log("true");
        res.send({validar: true, respuesta: {tabla_puntuaciones}})    
    }
    else{
        console.log("false");
        res.send({validar:false})    
    }   
});


app.post('/tabla_puntos', function(req, res)
{
    //Petición GET con URL = "/", lease, página principal.
    console.log(req.query); //En req.query vamos a obtener el objeto con los parámetros enviados desde el frontend por método GET
    res.render('tabla_puntuaciones'); //Renderizo página "login" sin pasar ningún objeto a Handlebars
});


app.post('/palabras_ods', async function(req, res) {
    console.log("Soy un pedido POST", req.body); //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método PUT
    let palabras= await MySQL.realizarQuery(`SELECT distinct palabra FROM palabras WHERE dificultad="ods";`)
    //Chequeo el largo del vector a ver si tiene datos
    if (palabras.length > 0) {
        //Armo un objeto para responder
        console.log("true palabras_ods");
        res.send({validar: true, respuesta: {palabras}})    
    }
    else{
        console.log("false");
        res.send({validar:false})    
    }   
});

app.put('/palabra_existe', async function(req, res) {
    let palabra_ingresada =  req.body.palabra_ingresada;
    let palabra_existente =  await MySQL.realizarQuery(`SELECT palabra FROM palabras WHERE palabra= "${palabra_ingresada}";`)
    if(palabra_existente!=""){
        res.send({existe: true})
    }          
    else{
        res.send({existe: false})
    }
});

// ACORDATEW DEL toLowerCase ()
