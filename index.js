//Datos fijos de los costos del club y sus categorias
const cuota_activo = 4950;
const cuota_cadete = 3100;
const cuota_menores = 2700;
const cuota_dep_menores = 650;
const cuota_dep_cadetes = 850;
const costo_tercer_tiempo = 2000;
const soc_activo = "SOCIO ACTIVO";
const soc_cadete = "SOCIO CADETE MAYOR";
const soc_menor = "SOCIO CADETE MENOR";

let formulario = document.getElementById("formulario");
let lista_costos = document.getElementById("costos");
let datos_socio = document.getElementById("datos_socio");
//Listeners
formulario.addEventListener("submit", nuevo_registro);
window.addEventListener("load", () => {
  //Al cargar todos los recuersos, traemos los datos de db.json
  cargarBaseDeDatos();
});

async function cargarBaseDeDatos() {
  let socios = getSociosLocalStorage();
  if (!socios) {
    try {
      const response = await fetch("db.json");
      let data = await response.json();
      localStorage.setItem("socios", JSON.stringify(data));
    } catch (error) {
      mostrarAlerta({
        position: "center",
        icon: "error",
        title: "Ha ocurrido un error",
        text: "No se pudo establecer conexion con la base de datos. Vuelva a intertarlo",
        showConfirmButton: true,
        timer: 0,
      });
    }
  }
}

function nuevo_registro(e) {
  e.preventDefault();
  let nombre = document.getElementById("nombre").value;
  let apellido = document.getElementById("apellido").value;
  let dni = parseInt(document.getElementById("dni").value);
  let edad = document.getElementById("edad").value;
  let telefono = document.getElementById("telefono").value;
  let esJugador = document.getElementById("select_jugador").value;
  let obra_social = document.getElementById("obra_social").value;

  //Validar los inputs obligatorios
  if (nombre === "" || apellido === "" || dni === "" || edad === "") {
    return mostrarAlerta({
      position: "center",
      icon: "error",
      title: "Campos obligatorios",
      text: "Debe rellenar todos los campos obligatorios",
      showConfirmButton: true,
      timer: 5000,
    });
  }
  limpiarCostos();
  let existeSocio = verificarExisteSocio(dni);

  if (existeSocio) {
    return mostrarAlerta({
      position: "center",
      icon: "warning",
      title: "Usuario ya registrado",
      text: "El DNI ingresado se encuentra en uso",
      showConfirmButton: true,
      timer: 5000,
    });
  } else {
    let data = getSociosLocalStorage();
    let nuevo_socio = {
      dni: dni,
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      esJugador: esJugador === "si" ? true : false,
      obra_social: obra_social,
    };
    data.socios.push(nuevo_socio);
    localStorage.setItem("socios", JSON.stringify(data));
    //Registro exitoso
    mostrarAlerta({
      position: "center",
      icon: "success",
      title:
        "Tu regristro se completo con exito! Bienvenido a la familia verde!",
      showConfirmButton: true,
      timer: 2500,
    });
    formulario.reset();

    //Mostramos los costos con los datos del socio
    mostrarCostos(edad);
  }
}

function categoria_social(edad) {
  if (edad > 1 && edad <= 11) {
    return soc_menor;
  } else if (edad >= 12 && edad < 18) {
    return soc_cadete;
  } else if (edad >= 18) {
    return soc_activo;
  }
}

function costo_social(edad) {
  if (edad > 1 && edad <= 11) {
    return cuota_menores;
  } else if (edad >= 12 && edad < 18) {
    return cuota_cadete;
  } else if (edad >= 18) {
    return cuota_activo;
  }
}

function costo_deportivo(edad) {
  if (edad > 1 && edad <= 11) {
    return cuota_dep_menores;
  } else if (edad >= 12 && edad < 18) {
    return cuota_dep_cadetes;
  } else if (edad >= 18) {
    return " (Sin costo deportivo)";
  }
}

function mostrarAlerta(props) {
  const { position, icon, title, text, showConfirmButton, timer } = props;
  Swal.fire({
    position: position,
    icon: icon,
    title: title,
    text: text,
    showConfirmButton: showConfirmButton,
    timer: timer,
  });
}

function verificarExisteSocio(dni) {
  let data = getSociosLocalStorage();
  //Recorremos el array para verificar que el dni ingresado no exista dentro de los usuarios en nuestra db
  let socioExistente = data.socios.find((socio) => socio.dni === dni);
  return socioExistente;
}

function getSociosLocalStorage() {
  return JSON.parse(localStorage.getItem("socios"));
}

function mostrarCostos(edad) {
  let li_categoria = document.createElement("li");
  let li_valor = document.createElement("li");
  let li_valor_deportivo = document.createElement("li");

  li_categoria.innerHTML = crearTextoCosto("Categoria", categoria_social(edad));
  li_valor.innerHTML = crearTextoCosto("Costo social", costo_social(edad));
  li_valor_deportivo.innerHTML = crearTextoCosto(
    "Costo deportivo",
    costo_deportivo(edad)
  );

  lista_costos.append(li_categoria);
  lista_costos.append(li_valor);
  lista_costos.append(li_valor_deportivo);
  datos_socio.classList.add("datos_socio_borde");
}

function limpiarCostos() {
  datos_socio.classList.remove("datos_socio_borde");
  lista_costos.innerHTML = "";
}

function crearTextoCosto(tipo, valor) {
  return `<span>${tipo}: <span class="item_costo">${valor}</span></span>`;
}
