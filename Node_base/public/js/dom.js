
//Esta funcion la llama el boton Ingresar que tiene que ser type button para ejecutar el onclick
function login() {
  //Leo los datos del input
  console.log("LOGIN");
  let usuario = document.getElementById("email").value;
  let contraseña = document.getElementById("password").value;

  //Creo un objeto de forma instantanea
  let data = {
      user: usuario,
      pass: contraseña
  }

  //data es el objeto que le paso al back
  putJSON(data)
}

function intentarOtraVez(){
    let div_intentarAgain = document.getElementById("nuevoIntento")
    document.getElementById("email").value=""
    document.getElementById("password").value=""
    div_intentarAgain.innerHTML = `
    <h2> El usuario o la contraseña son INCORRECTAS</h2>
    `
   
}

async function putJSON(data) {
    //putJSON() es solo el nombre de esta funcion que lo pueden cambiar     

    try {
      const response = await fetch("/login", {
        method: "PUT", // or 'POST'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      //En result obtengo la respuesta
      const result = await response.json();
      console.log("Success:", result);

      if (result.validar == false) {
        intentarOtraVez()
      } else {
        document.getElementById("form_login").submit()
      }

    } catch (error) {
      console.error("Error:", error);
    }
  }

function changeRegister() {
    const registed = document.getElementById("new_contact");
    if(registed.style.display !== "none") {
        registed.style.display = "none";
    }
    else {
        registed.style.display = "";
    }
} 
/*

function verifyEmail() {
  //Leo los datos del input
  console.log("verificarmail");
  let email_ = document.getElementById("verificar_mail").value;

  //Creo un objeto de forma instantanea
  let data = {
      user: email_
  }

  //data es el objeto que le paso al back
  putJSON_2(data)
}

async function putJSON_2(data) {

    try {
      const response = await fetch("/verifyEmail", {
        method: "POST", // or 'POST'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      //En result obtengo la respuesta
      const result = await response.json();
      console.log("Success:", result);

      if (result.validar == false) {
        console.log("Intente de nuevo")
      } else {
        document.getElementById("nuevochat").submit()
      }

    } catch (error) {
      console.error("Error:", error);
    }
  }
*/
async function fetchChats(){
  try {
    const response = await fetch("/cargar_chat", {
      method: "PUT", // or 'POST'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);

    if (result.validar == false) {
      console.error("A:Error:", error);
    } 
    else {
      /* recorrer respuesta y armar la tabla  */
      cargarChats(result.respuesta.usuarios_chats, result.usuario_);
      //desplegarMensajes()
      //document.getElementById("form_login").submit()
    }
  } catch (error) {
    console.error("B:Error:", error);
  }
}

function cargarChats(usuarios_chats, usuario_) {
  const tablaChats_creados = document.getElementById("desplegar_chats_creados");
  let user_logueado = usuario_.usuario_logueado;
  let length_chats = usuarios_chats.length
  let listar_var_4 = ""; 
  for (let u = 0; u < usuarios_chats.length; u++) {
    if(user_logueado == usuarios_chats[u].nombre_receptor || user_logueado == usuarios_chats[u].user_contacto) {
      listar_var_4 +=
    
      `
      <div class="card">
          <div class="card-body">
  
              <ul class="list-unstyled mb-0">
                  <li class="p-2 border-bottom" style="background-color: #eee;">
                      <a href="#!" class="d-flex justify-content-between">
                      <div class="d-flex flex-row">`
                      if (usuarios_chats[u].nombre_receptor == user_logueado) {
                        listar_var_4 +=
                          `<div class="pt-1">
                                <button class="fw-bold mb-0" onclick="cambiarChat(this, ${usuarios_chats[u].id}, '${usuarios_chats[u].user_contacto}')" id="${usuarios_chats[u].id}">${usuarios_chats[u].user_contacto}</button> 
                              </div>
                              </div>
                            <div class="pt-1">
                                <p class="small text-muted mb-1" id="${usuarios_chats[u].id}" >Chat id: ${usuarios_chats[u].id}</p>
                              </a>
                          </li>
                      </ul>
            
                  </div>
              </div>
                        `
                        listar_var_4
                      } else {
                        listar_var_4 +=
                        `<div class="pt-1">
                              <button class="fw-bold mb-0" onclick="cambiarChat(this, ${usuarios_chats[u].id}, '${usuarios_chats[u].nombre_receptor}')" id="${usuarios_chats[u].id}">${usuarios_chats[u].nombre_receptor}</button> 
                            </div>
                          </div>
                        <div class="pt-1">
                          <p class="small text-muted mb-1" id="${usuarios_chats[u].id}" >Chat id: ${usuarios_chats[u].id}</p>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
      `
      }
      listar_var_4 += `<div class="sidebar">
                        <ul class="list-unstyled">
                            <li id="tabla_mensajes_${usuarios_chats[u].id}" style="display: none">
                                                    
                            </li>
                    </div>`
    }
  }
  if (listar_var_4 == "") {
    listar_var_4 += `<p> no hay chats previos </p>`
  }
  tablaChats_creados.innerHTML = listar_var_4;
}

function fetcheado() {
  //Leo los datos del input
  let email_ = document.getElementById("verificar_mail").value;
  //let apodo = document.getElementById("apodo").value;

  //Creo un objeto de forma instantanea
  let data = {
      mail: email_,
  }
  adminUsuarios(data)
}

async function adminUsuarios(data){
  console.log("soy admin usuarios", data)
  try {
    const response = await fetch("/verify_Email", {
      method: "PUT", // or 'POST'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
      console.log(result);

    if (result.validar == false) {
      console.error("A:Error:", error);
    } 
    else {
      /* recorrer respuesta y armar la tabla  */
      console.log(result.respuesta.verificacion)
      crearChat(result.respuesta.verificacion);
      //desplegarMensajes()
      //document.getElementById("form_login").submit() [0].user_contacto
    }

  } catch (error) {
    console.error("B:Error:", error);
  }
}

function getMail() {
  return document.getElementById("verificar_mail").value;
}

function crearChat(verificacion) {
  const tablaChats = document.getElementById("tabla_chat");
  let mail_ = getMail();
  let id_chat = verificacion[0].id_usuarioschats;
  let listar_var = "";
  if(tablaChats.style.display !== "none") {
    tablaChats.innerHTML = "";
  }
  else {
    tablaChats.style.display = "";
  }
  listar_var += `
    <div class="card">
      <div class="card-body">

          <ul class="list-unstyled mb-0">
              <li class="p-2 border-bottom" style="background-color: #eee;">
                  <a href="#!" class="d-flex justify-content-between">
                  <div class="d-flex flex-row">
                      <div class="pt-1">
                      <button class="fw-bold mb-0" onclick="cambiarChat(this, ${id_chat}, ${mail_})" id="${id_chat}">${mail_}</button>
                      </div>
                  </div>
                  <div class="pt-1">
                    <p class="small text-muted mb-1" id="${id_chat}" >Chat id: ${id_chat}</p>
                  </a>
                  </a>
              </li>
          </ul>
      </div>
  </div>
  <div class="column">
    <ul class="list-unstyled">
        <li "id="tabla_mensajes_${id_chat}" style="display: none">
                                
        </li>
  </div>
  `
  tablaChats.innerHTML = listar_var;
}


//cambiarchat debe recibir el parametro usuario

function cambiarChat(boton, id_chat_2, usuario_upload) {
  let id_mensajes_display = id_chat_2;
  const desplegar_el_chat = document.getElementById("tabla_mensajes_" + id_mensajes_display);
  if(desplegar_el_chat.style.display !== "none") {
    desplegar_el_chat.style.display = "none";
  }
  else {
    desplegar_el_chat.style.display = "";
    console.log("abierto")
    console.log(boton.id)
    socket.emit("join-chat", { idchat: boton.id});
    emitUpload(id_mensajes_display, usuario_upload)
  }
}   

socket.on("messages-upload", data => {//HACER FOR PARA LOS MENSAJES 
    const desplegar_el_chat = document.getElementById("tabla_mensajes_" + data.vector[0].id);
    let listar_var_2 = '';
    console.log(data);
    if (data.vector.length == 1 && data.vector[0].mensaje == "") {
      listar_var_2 += `<p>No hay mensajes para cargar, inicia la conversacion!</p>`
    } else{
      for (let i = 0; i < data.vector.length; i++) {
        if (data.vector[i].mensaje == "") {
          listar_var_2 += ""
        } else {
          listar_var_2 += `<div class="card w-100">
          <div class="card-header d-flex justify-content-between p-3">
              <p class="fw-bold mb-0">${data.vector[i].user_contacto}</p>
              <p class="text-muted small mb-0"><i class="far fa-clock"></i>Just now</p>
          </div>
          <div class="card-body">
              <p class="mb-0">
              ${data.vector[i].mensaje}
              </p>
          </div>
        </div>
        <div class="shadow p-3 mb-5 bg-white rounded">
          <div id="allMessages">
          </div>
        </div>`
        listar_var_2 += '</ul>'
        }
      }
    }
    listar_var_2 += `
                           <ul class="list-unstyled"> 
                            <li id="tablamensajes${data.vector[0].id}" style="display: none">
                                                    
                            </li>  `
    listar_var_2 += `<li class="bg-white mb-3">
                        <div class="form-outline">
                          <input type="text" id="mensaje${data.vector[0].id}" name="mensaje${data.vector[0].id}">
                          <label class="form-label" for="textAreaExample2">Message</label>
                        </div>
                    </li>
                    <h2> </h2>
                    
    <button type="button" class="btn btn-info btn-rounded float-end" onclick="emitMessage(${data.vector[0].id})">Send</button>
    </ul>`
    desplegar_el_chat.innerHTML = listar_var_2;
  });

socket.on("connect", () => {
    console.log("Me conecté a WS");
});

socket.on("server-message", data => {
  let getMensaje = data.mensaje;
  let getUser = data.user;
  let getChat = data.chat
  mandarMensaje(getMensaje, getUser, getChat);
});

function mandarMensaje(getMensaje, getUser, getChat) {
  const message_ = document.getElementById("tablamensajes" + getChat);
  let listar_var_3 = "";
  var today_2 = new Date();
  let contHoras = today_2.getHours()
  let contMinutos = today_2.getMinutes()
  if(contHoras.toString().length == 1) {
    var hora = "0" + today_2.getHours();
  } else if (contHoras.toString().length == 2){
    var hora = today_2.getHours();
  }
  if(contMinutos.toString().length == 1) {
    var minuto = "0" + today_2.getMinutes();
  } else if (contMinutos.toString().length == 2){
    var minuto = today_2.getMinutes();
  }
  var hora_minutos = hora + ":" + minuto;
  listar_var_3 = `   
  <div class="card w-100">
    <div class="card-header d-flex justify-content-between p-3">
        <p class="fw-bold mb-0">${getUser}</p>
        <p class="text-muted small mb-0"><i class="far fa-clock"></i>${hora_minutos}</p>
    </div>
    <div class="card-body">
        <p class="mb-0">
        ${getMensaje}
        </p>
    </div>
  </div>
  <div class="shadow p-3 mb-5 bg-white rounded">
    <div id="allMessages">
    </div>
  </div>`
  listar_var_3 += '</ul>'
  message_.innerHTML += listar_var_3
  message_.style.display = ""
}
/*
function innerMessage() {
  const message_ = document.getElementById("tabla_mensajes_2");
  let mensaje_ = getMessageContent();
  let listar_var_3 = "";
  if(message_.style.display !== "none") {
    message_.innerHTML = "";
  }
  else {
    message_.style.display = ""
  }
  listar_var_3 = `   
  <div class="card w-100">
    <div class="card-header d-flex justify-content-between p-3">
        <p class="fw-bold mb-0">Lara Croft</p>
        <p class="text-muted small mb-0"><i class="far fa-clock"></i> 13 mins ago</p>
    </div>
    <div class="card-body">
        <p class="mb-0">
        ${mensaje_}
        </p>
    </div>
  </div>
  <div class="shadow p-3 mb-5 bg-white rounded">
    <div id="allMessages">
    </div>
  </div>`
  listar_var_3 += '</ul>'
  message_.innerHTML = listar_var_3
}*/
/*
async function adminUsuarioss(){
  try {
    const response = await fetch("/admin_usuarios", {
      method: "PUT", // or 'POST'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);

    if (result.validar == false) {
      console.error("Error:", error);
    } 
    else {
     
      listarUsuarioss(result.respuesta.usuarios);
      //document.getElementById("form_login").submit()
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

function listarUsuarioss(usuarios) {
  const tablaUsuarios = document.getElementById("tablaAdmin");
  let listar_var = "";
  if(tablaUsuarios.style.display !== "none") {
    tablaUsuarios.innerHTML = "";
  }
  else {
    tablaUsuarios.style.display = "";
  }
  listar_var += `
      <div><br><h3> Administracion de Usuarios </h3><br></div>
      <table class="table">
          <thead class="thead-dark">
              <tr></tr>
              <tr>
                  <th scope="col">ID</th>
                  <th scope="col">USUARIO</th>
                  <th scope="col">MAIL</th>
                  <th scope="col"></th>
                  <th scope="col"></th>
              </tr>
          </thead> 
      <tbody>`
  console.log(usuarios.length);  
  for (let u = 0; u < usuarios.length; u++) {
      listar_var +=` 
          <tr>
              <th scope="row">${usuarios[u].id}</th>
              <td>${usuarios[u].usuario}</td>
              <td>${usuarios[u].gmail}</td>
              <td><button class="btn btn-danger" onclick="deleteUsuario(${usuarios[u].id})"><i class="fa fa-trash" ></i></button>
              <td><button class="form-check-control btn btn-success" onclick="getPuntajes(${usuarios[u].id},'${usuarios[u].usuario}')">Puntajes</i></button>
              </td>
          </tr>`
  }
  listar_var +=`
  </tbody>
  </table>`
  tablaUsuarios.innerHTML = listar_var;
}
*/