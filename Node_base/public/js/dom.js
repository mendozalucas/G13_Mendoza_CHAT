//Esta funcion la llama el boton Ingresar que tiene que ser type button para ejecutar el onclick
 function login() {
  //Leo los datos del input
  console.log("LOGIN");
  console.log("EN EL DOM palabra incognita 2: "+palabra_incognita)
  let usuario = document.getElementById("usuario_login").value;
  let contraseña = document.getElementById("password").value;

  //Creo un objeto de forma instantanea
  let data = {
      user: usuario,
      pass: contraseña
  }

  //data es el objeto que le paso al back
  putJSON(data)
}

function elUsuarioExiste(){
    let div_usersExist = document.getElementById("yaExiste")

    div_usersExist.innerHTML = `
    <h2 > El usuario ya existe </h2>
    ` 
}

function intentarOtraVez(){
    let div_intentarAgain = document.getElementById("nuevoIntento")
    document.getElementById("usuario_login").value=""
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

 
  async function adminUsuarios(){
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
      /* recorrer respuesta y armar la tabla  */
      listarUsuarios(result.respuesta.usuarios);
      //document.getElementById("form_login").submit()
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

function listarUsuarios(usuarios) {
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

async function deleteUsuario(id){
  let data = {
    idUsuario: id
  }
  try {
    const response = await fetch("/delete_usuario", {
      method: "DELETE", // or 'POST'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);

    if (result.validar == false) {
      console.error("Error:", error);
    } 
    else {
      /* recorrer respuesta y armar la tabla  */
      listarUsuarios(result.respuesta.usuarios);
      //document.getElementById("form_login").submit()
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

async function getPuntajes(id, usuario){
  let data = {
    idUsuario: id
  }
  try {
    const response = await fetch("/get_puntajes", {
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
      console.error("Error:", error);
    } 
    else {
      /* recorrer respuesta y armar la tabla  */
      mostrarPuntajes(result.respuesta.puntajes, usuario);
      //document.getElementById("form_login").submit()
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

function mostrarPuntajes(puntajes, usuario) {
  const tablaUsuarios = document.getElementById("tablaAdmin");
  let listar_var = "";
  if(tablaUsuarios.style.display !== "none") {
    tablaUsuarios.innerHTML = "";
  }
  else {
    tablaUsuarios.style.display = "";
  }
  listar_var += `
      <div><br><h3> Puntajes del usuario: <b>${usuario}</b> </h3><br></div>
      <table class="table">
          <thead class="thead-dark">
              <tr></tr>
              <tr>
                  <th scope="col">ID</th>
                  <th scope="col">PALABRA</th>
                  <th scope="col">PUNTAJE</th>
                  <th scope="col"></th>
              </tr>
          </thead> 
      <tbody>`
  console.log(puntajes.length);  
  for (let u = 0; u < puntajes.length; u++) {
      listar_var +=` 
          <tr>
              <th scope="row">${puntajes[u].id}</th>
              <td>${puntajes[u].palabra}</td>
              <td>${puntajes[u].puntaje}</td>
              <td><button class="btn btn-danger" onclick="deletePuntaje(${puntajes[u].id},${puntajes[u].user_id},'${usuario}')"><i class="fa fa-trash" ></i></button>
              </td>
          </tr>`
  }
  listar_var +=`
  </tbody>
  </table>`
  tablaUsuarios.innerHTML = listar_var;
}

async function deletePuntaje(id, id_usuario, usuario){
  let data = {
    idPuntaje: id,
    idUsuario: id_usuario
  }
  console.log(data);
  try {
    const response = await fetch("/delete_puntaje", {
      method: "DELETE", // or 'POST'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);

    if (result.validar == false) {
      console.error("Error:", error);
    } 
    else {
      /* recorrer respuesta y armar la tabla  */
      mostrarPuntajes(result.respuesta.puntajes, usuario);
      //document.getElementById("form_login").submit()
    }

  } catch (error) {
    console.error("Error:", error);
  }
}


async function adminPalabras(){
  try {
    const response = await fetch("/admin_palabras", {
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
      listarPalabras(result.respuesta.palabras);
      //document.getElementById("form_login").submit()
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

function listarPalabras(palabras) {
  const tablaPalabras = document.getElementById("tablaAdmin");
  let listar_var = "";
  if(tablaPalabras.style.display !== "none") {
    tablaPalabras.innerHTML = "";
  }
  else {
    tablaPalabras.style.display = "";
  }
  listar_var += `
      <div><br><h3> Administracion de Palabras </h3><br></div>
      <td><button class="btn btn-success" onclick="verAgregarPalabra()">Agregar Palabra</button>
      <table class="table">
          <thead class="thead-dark">
              <tr></tr>
              <tr>
                  <th scope="col">PALABRA</th>
                  <th scope="col">DIFICULTAD</th>
                  <th scope="col"></th>
              </tr>
          </thead> 
      <tbody>`
  console.log(palabras.length);  
  for (let u = 0; u < palabras.length; u++) {
      listar_var +=` 
          <tr>
              <th scope="row">${palabras[u].palabra}</th>
              <td>${palabras[u].dificultad}</td>
              <td><button class="btn btn-danger" onclick="deletePalabra('${palabras[u].palabra}')"><i class="fa fa-trash" ></i></button>
              </td>
          </tr>`
  }
  listar_var +=`
  </tbody>
  </table>`
  tablaPalabras.innerHTML = listar_var;
}

async function deletePalabra(palabra){
  let data = {
    idPalabra: palabra
  }
  console.log(data);
  try {
    const response = await fetch("/delete_palabra", {
      method: "DELETE", // or 'POST'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);

    if (result.validar == false) {
      console.error("Error:", error);
    } 
    else {
      /* recorrer respuesta y armar la tabla  */
      listarPalabras(result.respuesta.palabras);
      //document.getElementById("form_login").submit()
    }

  } catch (error) {
    console.error("Error:", error);
  }
}
 
async function pushPuntos(data) {
  //putJSON() es solo el nombre de esta funcion que lo pueden cambiar     

  try {
    const response = await fetch("/push_puntos", {
      method: "PUT", // or 'POST'
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);

    if (result.validar == false) {
      intentarOtraVez()
    } else {
      //Envio el formularia desde dom para cambiar de pagina
      //Podria usar tambien un changeScreen()
      document.getElementById("form1").submit()
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

function verAgregarPalabra() {
  const tablaPalabras = document.getElementById("tablaAdmin");
  let listar_var = "";
  if(tablaPalabras.style.display !== "none") {
    tablaPalabras.innerHTML = "";
  }
  else {
    tablaPalabras.style.display = "";
  }
  listar_var += `
      <div><br><h3> Agregar Palabra </h3><br></div>
      <div >
        <label for="palabra">Palabra  </label>
        <input type="text" id="palabra">
      </div>
      <div><br></div>
      <div >
        <label for="dificultad">Dificultad  </label>
        <select id="dificultad">
            <option selected="selected">facil</option>
            <option>medio</option>
            <option>dificil</option>
        </select>
      </div>
      <div><br></div>
      <div class="form-group">                  
        <button class="form-check-control btn btn-success" onclick="insertarPalabra();">Confirmar</button>
      </div>`
  tablaPalabras.innerHTML = listar_var;
}

async function insertarPalabra(){
  let newPalabra = document.getElementById("palabra").value;
  let newDificultad = document.getElementById("dificultad").value;
  console.log(newDificultad);

  let data = {
    palabra: newPalabra,
    dificultad: newDificultad
  };
  console.log(data);
  try {
    const response = await fetch("/insert_palabra", {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);

    if (result.validar == false) {
      console.error("Error:", error);
    } 
    else {
      /* recorrer respuesta y armar la tabla  */
      listarPalabras(result.respuesta.palabras);
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

async function insertPuntaje(id_usuario, palabra, puntaje){
  let data = {
    idUser: id_usuario,
    word: palabra,
    score: puntaje
  }
  try {
    const response = await fetch("/insert_puntaje", {
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
      console.error("Error:", error);
    } 
    else {
      ///ver que hacer 
      console.log("El puntaje se inserto bien");
    }

  } catch (error) {
    console.error("Error:", error);
  }
}



async function usuarioPuntaje(){
  try {
    const response = await fetch("/tabla_puntuaciones", {
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
      /// recorrer respuesta y armar la tabla 
      listarPuntajes(result.respuesta.tabla_puntuaciones);
      //document.getElementById("form_login").submit()
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

function listarPuntajes(tabla_puntuaciones) {
  const tablaPuntaje = document.getElementById("tablaPuntuaciones");
  let listar_var_p = "";
  if(tablaPuntaje.style.display !== "none") {
    tablaPuntaje.innerHTML = "";
  }
  else {
    tablaPuntaje.style.display = "";
  }
  listar_var_p += `
    <div><br><h3> Administracion de Usuarios </h3><br></div>
    <table class="table">
      <thead class="thead-dark">
        <tr></tr>
        <tr>
          <th scope="col">PUNTOS</th>
          <th scope="col">USUARIO</th>
        </tr>
      </thead> 
    <tbody>` 
  for (let h = 0; h < tabla_puntuaciones.length; h++) {
      listar_var_p +=` 
          <tr>
              <th scope="row">${tabla_puntuaciones[h].puntos}</th>
              <td>${tabla_puntuaciones[h].nombre_usu}</td>
          </tr>`
  }
  listar_var_p +=`
  </tbody>
  </table>`
  tablaPuntaje.innerHTML = listar_var_p;
}



async function palabraExiste(palabra){
  let data = {
    palabra_ingresada: palabra
  }

  try {
    const response = await fetch("/palabra_existe", {
      method: "PUT", // or 'POST'
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    });
     

    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);


    if (result.existe === false) {
      console.log("la palabra NO existe")
      return false
    } 
    else {
      console.log("La palabra existe");
      return true
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function palabras(indice) {
  let div_resultado = document.getElementById("resultado")
  div_resultado.innerHTML = `<h2>  </h2>`
  //Leo los datos del input
  console.log("PALABRAS "+indice);
  nroIndice=parseInt(indice);
  let cubo1 = document.getElementById("cubo_"+(nroIndice+1)).value;
  let cubo2 = document.getElementById("cubo_"+(nroIndice+2)).value;
  let cubo3 = document.getElementById("cubo_"+(nroIndice+3)).value;
  let cubo4 = document.getElementById("cubo_"+(nroIndice+4)).value;
  let cubo5 = document.getElementById("cubo_"+(nroIndice+5)).value;
  
  if(!cubo1 || !cubo2 || !cubo3|| !cubo4 || !cubo5 ){
    console.log("Debe ingresar todas las letras")
    div_resultado.innerHTML = `<h2> Debe ingresar todas las letras </h2>`
    return false
  }

  let palabra_ingresada=cubo1+cubo2+cubo3+cubo4+cubo5;
  console.log("palabra incognita dom: "+palabra_incognita);
  console.log("palabra ingresada dom: "+palabra_ingresada);

  let palabra_ingresada_minuscula=palabra_ingresada.toLowerCase()
  //let existe=palabraExiste(palabra_ingresada_minuscula);
  
  //palabraExiste(palabra_ingresada_minuscula).then((v) => { let existe=v;  });
  let data = {
    palabra_ingresada: palabra_ingresada_minuscula
  }
  try {
    const response = await fetch("/palabra_existe", {
      method: "PUT", // or 'POST'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
     
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);

    if (result.existe === false) {
      console.log("la palabra NO existe")
      let div_resultado = document.getElementById("resultado")
      div_resultado.innerHTML = `<h2> La Palabra no Existe </h2>`
      return false
    } 
    else {
      console.log("La palabra existe");
      verificar_palabra(palabra_ingresada,palabra_incognita, nroIndice);
  }
  } catch (error) {
    console.error("Error:", error);
  }
}

function verificar_palabra(palabra_ingresada, palabra_incognita, nroIndice){
  let div_resultado = document.getElementById("resultado")

  if(palabra_ingresada.toLowerCase()==palabra_incognita.toLowerCase()){
    console.log("GANO!!!!!");
    document.getElementById("cubo_"+(nroIndice+1)).className = "Cuadrado verde";
    document.getElementById("cubo_"+(nroIndice+2)).className = "Cuadrado verde";
    document.getElementById("cubo_"+(nroIndice+3)).className = "Cuadrado verde";
    document.getElementById("cubo_"+(nroIndice+4)).className = "Cuadrado verde";
    document.getElementById("cubo_"+(nroIndice+5)).className = "Cuadrado verde";
    
    div_resultado.innerHTML = `<h2> GANASTE!!! </h2>` 
  }
  else{
    let color="";
    console.log(palabra_incognita.length)
    for (let i=0; i < palabra_ingresada.length; i++){
      console.log("i "+i)
      k=nroIndice+parseInt(i)+1;
      for (let j=0; j < palabra_incognita.length; j++){
            console.log("j= "+j)
            if (palabra_ingresada[i].toLowerCase() == palabra_incognita[j].toLowerCase()){
                console.log("j= "+j+" "+palabra_ingresada[i].toLowerCase()+" "+palabra_incognita[j].toLowerCase())
                if(i===j){
                    console.log("poner en verde cubo_"+k);
                    document.getElementById("cubo_"+k).className = "Cuadrado verde";
                    break;
                }
                else{
                    console.log("poner en amarillo cubo_"+k);
                    document.getElementById("cubo_"+k).className = "Cuadrado amarillo";
                    break;
                }         
            }
            else{
                console.log("dejar en gris cubo_"+k)
                document.getElementById("cubo_"+k).className = "Cuadrado gris";
            }
      }
    }
  }
  k++;
  if(k<26){
    let input = document.getElementById("cubo_"+k);
    input.focus();
    /*document.getElementById("form_palabra").submit();*/
  }  
  else{
    div_resultado.innerHTML = `<h2> PERDISTE!!! </h2>` 
  }
  
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
} 

async function obtenerPalabraJuego(){
  //palabras_ODS=["sucio", "coral", "buceo", "beber", "fluir", "resto", "sobra", "flujo"]
  try {
    const response = await fetch("/palabras_ods", {
      method: "POST", // or 'POST'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    });

    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);

    if (result.validar == false) {
      console.log("No hay palabras ODS en la tabla")
    } 
    else {
      console.log("palabras ods: "+result.respuesta.palabras.length)
      let num_aleatorio = getRandomInt(result.respuesta.palabras.length)
      console.log(num_aleatorio)
      palabra_juego = result.respuesta.palabras[num_aleatorio].palabra
      console.log("palabras juego: "+palabra_juego)
    }
  } catch (error) {
    console.error("Error:", error);
  }
  return palabra_juego
};

obtenerPalabraJuego().then((v) => {
  palabra_incognita=v;
  console.log("palabra incognita 2: "+palabra_incognita)
});






