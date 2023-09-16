
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
async function adminUsuarios(){
  try {
    const response = await fetch("/verify_Email", {
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
      console.log("holae");
      console.error("A:Error:", error);
    } 
    else {
      console.log("hola");
      /* recorrer respuesta y armar la tabla  */
      listarUsuarios(result.respuesta.verificacion);
      //document.getElementById("form_login").submit()
    }

  } catch (error) {
    console.error("B:Error:", error);
  }
}

function listarUsuarios(verificacion) {
  const tablaChats = document.getElementById("tabla_chat");
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
                    <p>jaja</p>
                    <p class="fw-bold mb-0">${verificacion[0].user_contacto}</p>
                    </div>
                </div>
                </a>
            </li>
        </ul>

    </div>
  </div>
      `
  tablaChats.innerHTML = listar_var;
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
        console.log("Intente de nuevo")
      } else {
        document.getElementById("nuevochat").submit()
      }

    } catch (error) {
      console.error("Error:", error);
    }
  }
*/