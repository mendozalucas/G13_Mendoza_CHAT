
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

async function adminUsuarios(){
  try {
    const response = await fetch("/verifyEmail", {
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
      /* recorrer respuesta y armar la tabla  */
      listarUsuarios(result.respuesta.verificacion);
      //document.getElementById("form_login").submit()
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

function listarUsuarios(verificacion) {
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