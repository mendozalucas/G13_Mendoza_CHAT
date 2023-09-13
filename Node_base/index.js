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

let id_contacto = 0
const app = express();
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
app.use(session({secret: '123456', resave: true, saveUninitialized: true}));


app.get("/", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    await authService.registerUser(auth, { email, password });
    id_contacto = id_contacto + 1
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
    req.session.Dato = req.body.email;
    // Aquí puedes redirigir al usuario a la página que desees después del inicio de sesión exitoso
    res.redirect("/menu");
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.render("login", {
      message: "Error en el inicio de sesión: " + error.message,
    });
  }
});

app.get("/menu", (req, res) => {
  // Agrega aquí la lógica para mostrar la página del menu
  console.log("Email logueado: " , req.session.Dato)
  res.render("menu");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  console.log("sesion destruida")
  res.render("login");
});

app.get("/chats", (req,res) => {
  res.render("chat");

});
/************************************** */
