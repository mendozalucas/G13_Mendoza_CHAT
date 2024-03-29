const express = require("express");
const exphbs = require("express-handlebars");
const session = require('express-session');
const bodyParser = require('body-parser');
const MySQL = require('./modulos/mysql');
const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
} = require("firebase/auth");

let id_chat_ = 1
const app = express();
app.use(express.static('/Node_base/public/js/Wordle.js'));


app.use(express.static('public')); //Expongo al lado cliente la carpeta "public"

app.use(bodyParser.urlencoded({ extended: false })); //Inicializo el parser JSON
app.use(bodyParser.json());

app.engine('handlebars', exphbs({defaultLayout: 'main'})); //Inicializo Handlebars. Utilizo como base el layout "Main".
app.set('view engine', 'handlebars'); //Inicializo Handlebars

const Listen_Port = 3000; //Puerto por el que estoy ejecutando la página Web

const server = app.listen(Listen_Port, function() {
    console.log('Servidor NodeJS corriendo en http://localhost:' + Listen_Port + '/');
});

const io = require('socket.io')(server);

const sessionMiddleware = session({
    secret: 'sararasthastka',
    resave: true,
    saveUninitialized: false,
});

app.use(sessionMiddleware);

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAihQBOk71Jma1BSF61yDYhITp46j-kbmI",
  authDomain: "chat-73d0e.firebaseapp.com",
  databaseURL: "https://chat-73d0e-default-rtdb.firebaseio.com",
  projectId: "chat-73d0e",
  storageBucket: "chat-73d0e.appspot.com",
  messagingSenderId: "302833650986",
  appId: "1:302833650986:web:a799cfe276ca10d6756253",
  measurementId: "G-JWCD1WPE10"
};

const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);

// Importar AuthService
const authService = require("./authService");


app.get("/", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    let userCredential = await authService.registerUser(auth, { email, password });
    let id_contacto = userCredential.user.uid
    await MySQL.realizarQuery(`
        INSERT INTO MC_contactos (id_contacto, user_contacto, password_contacto )
        VALUES ("${id_contacto}", "${email}", "${password}"); `)
    res.render("login", {
      message: "Registro exitoso. Puedes iniciar sesión ahora.",
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.render("register", {
      message: "Error en el registro: " + error.message,
    });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await authService.loginUser(auth, {
      email,
      password,
    });
    req.session.Id = userCredential.user.uid;
    req.session.Dato = req.body.email;
    console.log("usuario logueado: ", req.session.Dato, "con su respectiva ID", req.session.Id);
    // Aquí puedes redirigir al usuario a la página que desees después del inicio de sesión exitoso

    res.redirect("/chat");
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.render("login", {
      message: "Error en el inicio de sesión: " + error.message,
    });
  }
});

app.get("/chat", (req, res) => {
  // Agrega aquí la lógica para mostrar la página del menu
  //console.log("Email logueado: " , req.session.Dato)
  res.render("chat");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  console.log("sesion destruida")
  res.render("login");
});

app.put('/cargar_chat', async function(req, res) {
  let usuario_logueado = req.session.Dato;

  let usuarios_chats= await MySQL.realizarQuery(`SELECT MC_usuarioschats.id, MC_chats.nombre_receptor, MC_contactos.user_contacto
  FROM MC_usuarioschats
  INNER JOIN MC_chats ON MC_usuarioschats.id_chat = MC_chats.id_chat
  INNER JOIN MC_contactos ON MC_usuarioschats.id_contacto = MC_contactos.id_contacto`)
    //Chequeo el largo del vector a ver si tiene datos
    if (usuarios_chats.length > 0) {
        //Armo un objeto para responder
        console.log("true_put_chat");
        res.send({validar: true, respuesta: {usuarios_chats}, usuario_: {usuario_logueado}})    
    }
    else{
        console.log("false_put_chat");
        res.send({validar:false})    
    }   
});

app.put('/verify_Email', async function(req, res) {
  //Petición PUT con URL = "/login"
  let verificarMail = req.body.mail
  console.log("Soy un pedido PUT /verify_Email", req.body); //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método PUT
  //Consulto en la bdd de la existencia del usuario
  let verificacion_email = await MySQL.realizarQuery(`SELECT user_contacto FROM MC_contactos WHERE user_contacto = "${verificarMail}"`)
  //Chequeo el largo del vector a ver si tiene datos "${verificarMail}"
  //let id_contacto_logueado = await MySQL.realizarQuery(`SELECT id_contacto FROM MC_contactos WHERE user_contacto = "${req.session.Dato}"`);
  //console.log(id_contacto_logueado[0].id_contacto)
  if (verificacion_email.length > 0) {
      console.log("true_put");
      let verificar_id_chat = await MySQL.realizarQuery(`SELECT MC_usuarioschats.id as id_usuarioschats
      FROM MC_usuarioschats 
      INNER JOIN MC_chats ON MC_usuarioschats.id_chat = MC_chats.id_chat 
      INNER JOIN MC_contactos ON MC_usuarioschats.id_contacto = MC_contactos.id_contacto 
      WHERE MC_chats.nombre_receptor = "${req.session.Dato}" AND MC_contactos.user_contacto = "${verificarMail}"`);
    if (verificar_id_chat.length > 0) {
      let verificacion = verificar_id_chat;
      console.log("estoy en quito");
      res.send({validar: true, respuesta: {verificacion}}) 
    } else {
        let chat_nuevo = await MySQL.realizarQuery(`INSERT INTO MC_chats (nombre_receptor) VALUES ("${verificarMail}"); `);
        let verificar_id_chat_3 = await MySQL.realizarQuery(`SELECT id_chat FROM MC_chats WHERE nombre_receptor = "${verificarMail}"`)
        let carga_chats_usuario = await MySQL.realizarQuery(`INSERT INTO MC_usuarioschats (id_contacto, id_chat) VALUES ("${req.session.Id}", "${verificar_id_chat_3[0].id_chat}"); `);
        let verificar_id_chat_4 = await MySQL.realizarQuery(`SELECT MAX(MC_usuarioschats.id) as id_usuarioschats
        FROM MC_usuarioschats`);
        let verificacion = verificar_id_chat_4;
        console.log("estoy en cuba");
        res.send({validar: true, respuesta: {verificacion}})   
    }
  }
  else{
      console.log("false_put");
      res.send({validar:false})    
  }
    
});

io.on("connection", (socket) => {
  const req = socket.request;
  
  socket.on('incoming-message', data =>{
    console.log('INCOMING MESSAGE: ', data);
    //io.emit("server-message", { mensaje: data.mensaje, user: req.session.Dato });
    console.log('CHAT: ', req.session.id_chat);
    var today = new Date();
    var now = today.toLocaleString();
    let carga_chats_usuario = MySQL.realizarQuery(`INSERT INTO MC_mensajes (id_contacto, id, mensaje, fecha_hora) 
    VALUES ("${req.session.Id}", "${req.session.id_chat}", "${data.mensaje}", "${now}"); `); //ver sintax
    io.to(req.session.id_chat).emit("server-message", { mensaje: data.mensaje, user: req.session.Dato, chat: req.session.id_chat });
  });
  
  socket.on('upload-messages', async function(chat_upload) {
    let vector_mensajes = await MySQL.realizarQuery(`
    SELECT MC_mensajes.mensaje, MC_contactos.user_contacto, MC_usuarioschats.id, MC_mensajes.fecha_hora
    FROM MC_mensajes
    INNER JOIN MC_usuarioschats ON MC_mensajes.id = MC_usuarioschats.id
    INNER JOIN MC_contactos ON MC_mensajes.id_contacto = MC_contactos.id_contacto  
    WHERE MC_mensajes.id = "${chat_upload.upload_chat}"
    ORDER BY id_mensaje asc;`)
    if (vector_mensajes.length == 0) {
      //Crear nuevo chat, insert into
      let cargar_mensaje_vacio = await MySQL.realizarQuery(` INSERT INTO MC_mensajes (id_contacto, id, mensaje, fecha_hora)
      VALUES ("${req.session.Id}", "${chat_upload.upload_chat}", "", "")`)
      let vector_de_ejemplo_mensajes = await MySQL.realizarQuery(`
      SELECT MC_mensajes.mensaje, MC_contactos.user_contacto, MC_usuarioschats.id
      FROM MC_mensajes
      INNER JOIN MC_usuarioschats ON MC_mensajes.id = MC_usuarioschats.id
      INNER JOIN MC_contactos ON MC_usuarioschats.id_contacto = MC_contactos.id_contacto  
      WHERE MC_mensajes.id = "${chat_upload.upload_chat}";`)
      socket.emit("messages-upload", { vector: vector_de_ejemplo_mensajes})
    } else {
      socket.emit("messages-upload", { vector: vector_mensajes})
      
    }
  })  

  socket.on('join-chat', data =>{
    console.log('INCOMING IDCHAT', data);
    socket.join(data.idchat);
    req.session.id_chat = data.idchat; 
  });

});

//setInterval(() => io.emit("server-message", {mensaje: "HOLI" }), 5000);
