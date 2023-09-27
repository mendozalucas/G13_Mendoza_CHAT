
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
      console.log("holae");
      console.error("A:Error:", error);
    } 
    else {
      console.log("hola");
      /* recorrer respuesta y armar la tabla  */
      crearChat(result.respuesta[0].user_contacto);
      desplegarMensajes()
      //document.getElementById("form_login").submit()
    }

  } catch (error) {
    console.error("B:Error:", error);
  }
}

function getApodo() {
  return document.getElementById("apodo").value
}

function crearChat(user) {
  const tablaChats = document.getElementById("tabla_chat");
  let apodo_ = getApodo()
  let i = 1
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
                      <button class="fw-bold mb-0" onclick="cambiarChat()">${apodo_}</button>
                      </div>
                  </div>
                  </a>
              </li>
          </ul>

      </div>
  </div>`
  /*
  <div class="col-md-6 col-lg-7 col-xl-8" id="display_chat" style="display: none;">
            
    <ul class="list-unstyled">
      <li class="d-flex justify-content-between mb-4">
        <div class="card w-100">
            <div class="card-header d-flex justify-content-between p-3">
                <p class="fw-bold mb-0">Lara Croft</p>
                <p class="text-muted small mb-0"><i class="far fa-clock"></i> 13 mins ago</p>
            </div>
            <div class="card-body">
                <p class="mb-0">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                laudantium.
                </p>
            </div>
        </div>
      </li>
      <li class="bg-white mb-3">
        <div class="form-outline">
          <input type="text" for="textAreaExample2">Message</input>
        </div>
      </li>
      <button type="button" class="btn btn-info btn-rounded float-end">Send</button>
    <ul>
  </div>
      `*/
  i = i + 1
  tablaChats.innerHTML = listar_var;
}
function cambiarChat() {
  let n = 1
  const registed = document.getElementById("tabla_mensajes");
  if(registed.style.display !== "none") {
      registed.style.display = "none";
  }
  else {
      registed.style.display = "";
  }
} 
function desplegarMensajes(){
  const ulMensajes = document.getElementById("tabla_mensajes");
  let listar_var_2 = "";
  if(ulMensajes.style.display !== "none") {
    ulMensajes.innerHTML = "";
  }
  else {
    ulMensajes.style.display = "";
  }
  listar_var_2 = `
  <h2>EMPIEZA EL CHAT</h2>
                         <ul class="list-unstyled">
                          <li id="tabla_mensajes_2" style="display: none">
                                                  
                          </li>  `
  listar_var_2 += `<li class="bg-white mb-3">
                      <div class="form-outline">
                        <input type="text" id="mensaje" name="mensaje">
                        <label class="form-label" for="textAreaExample2">Message</label>
                      </div>
                  </li>
                  <h2> </h2>
                  
  <button type="button" class="btn btn-info btn-rounded float-end" onclick="emitMessage()">Send</button>
  </ul>`

  ulMensajes.innerHTML = listar_var_2
}

function getMessageContent() {
  return document.getElementById("mensaje").value
}

socket.on("connect", () => {
    console.log("Me conecté a WS");
});

socket.on("server-message", data => {
  console.log("Me llego del servidor", data.mensaje);
  console.log("Me llego del servidor", data.user);
  let getMensaje = data.mensaje;
  let getUser = data.user
  mandarMensaje(getMensaje, getUser)
});

function mandarMensaje(getMensaje, getUser) {
  const message_ = document.getElementById("tabla_mensajes_2");
  console.log("mensaje: ", getMensaje);
  let listar_var_3 = "";
  listar_var_3 = `   
  <div class="card w-100">
    <div class="card-header d-flex justify-content-between p-3">
        <p class="fw-bold mb-0">${getUser}</p>
        <p class="text-muted small mb-0"><i class="far fa-clock"></i> 13 mins ago</p>
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