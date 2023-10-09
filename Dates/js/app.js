const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");

const formulario = document.querySelector("#nueva-cita");
const contenedorCitas = document.querySelector("#citas");

let editando;
let citas = [];

class Citas {
  agregarCita(cita) {
    citas.push(cita);
    this.guardarCitas();
  }

  eliminarCita(id) {
    citas = citas.filter(cita => cita.id !== id);
    this.guardarCitas();
  }

  editarCita(citaActualizada) {
    citas = citas.map(cita => (cita.id === citaActualizada.id ? citaActualizada : cita));
    this.guardarCitas();
  }

  cargarCitas() {
    if (localStorage.getItem('citas')) {
      citas = JSON.parse(localStorage.getItem('citas'));
    }
  }

  guardarCitas() {
    localStorage.setItem('citas', JSON.stringify(citas));
  }
}

class UI {
  imprimirAlerta(mensaje, tipo) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }
    divMensaje.textContent = mensaje;
    document.querySelector("#contenido").insertBefore(divMensaje, document.querySelector(".agregar-cita"));
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  imprimirCitas() {
    this.limpiarHTML();
    citas.forEach(cita => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
      const divCita = document.createElement("div");
      divCita.classList.add("cita", "p-3");
      divCita.dataset.id = id;

      const mascotaParrafo = document.createElement("h2");
      mascotaParrafo.classList.add("card-title", "font-weight-bolder");
      mascotaParrafo.textContent = mascota;

      const propietarioParrafo = document.createElement("p");
      propietarioParrafo.innerHTML = `
        <span class="font-weight-bolder">Propietario: </span> ${propietario}
      `;

      const telefonoParrafo = document.createElement("p");
      telefonoParrafo.innerHTML = `
        <span class="font-weight-bolder">Teléfono: </span> ${telefono}
      `;

      const fechaParrafo = document.createElement("p");
      fechaParrafo.innerHTML = `
        <span class="font-weight-bolder">Fecha: </span> ${fecha}
      `;

      const horaParrafo = document.createElement("p");
      horaParrafo.innerHTML = `
        <span class="font-weight-bolder">Hora: </span> ${hora}
      `;

      const sintomasParrafo = document.createElement("p");
      sintomasParrafo.innerHTML = `
        <span class="font-weight-bolder">Síntomas: </span> ${sintomas}
      `;

      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("btn", "btn-danger", "mr-2", "ms-3");
      btnEliminar.innerHTML = `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>`;
      btnEliminar.onclick = () => eliminarCita(id);

      const btnEditar = document.createElement("button");
      btnEditar.classList.add("btn", "btn-info");
      btnEditar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>`;
      btnEditar.onclick = () => cargarEdicion(cita);

      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEditar);
      divCita.appendChild(btnEliminar);

      contenedorCitas.appendChild(divCita);
    });
  }

  limpiarHTML() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }
}

const ui = new UI();
const administrarCitas = new Citas();

eventListeners();

function eventListeners() {
  mascotaInput.addEventListener("input", datosCita);
  propietarioInput.addEventListener("input", datosCita);
  telefonoInput.addEventListener("input", datosCita);
  fechaInput.addEventListener("input", datosCita);
  horaInput.addEventListener("input", datosCita);
  sintomasInput.addEventListener("input", datosCita);

  formulario.addEventListener("submit", nuevaCita);
}

const citaObjeto = {
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
};

function datosCita(e) {
  citaObjeto[e.target.name] = e.target.value;
}

function nuevaCita(e) {
  e.preventDefault();

  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObjeto;

  if (mascota === "" || propietario === "" || telefono === "" || fecha === "" || hora === "" || sintomas === "") {
    ui.imprimirAlerta("Todos los campos son obligatorios", "error");
    return;
  }

  if (editando) {
    const citaExistente = citas.find(cita => cita.id === citaObjeto.id);

    citaExistente.mascota = mascota;
    citaExistente.propietario = propietario;
    citaExistente.telefono = telefono;
    citaExistente.fecha = fecha;
    citaExistente.hora = hora;
    citaExistente.sintomas = sintomas;

    ui.imprimirAlerta("Editado Correctamente");
    administrarCitas.editarCita({ ...citaObjeto });

    formulario.querySelector(`button[type="submit"]`).textContent = "Guardar Cita";
    editando = false;
  } else {
    citaObjeto.id = Date.now();
    administrarCitas.agregarCita({ ...citaObjeto });
    ui.imprimirAlerta("Se agregó correctamente");
  }
  reiniciarObjeto();
  formulario.reset();

  ui.imprimirCitas();
}

function reiniciarObjeto() {
  citaObjeto.mascota = "";
  citaObjeto.propietario = "";
  citaObjeto.telefono = "";
  citaObjeto.fecha = "";
  citaObjeto.hora = "";
  citaObjeto.sintomas = "";
}

function eliminarCita(id) {
  administrarCitas.eliminarCita(id);
  ui.imprimirAlerta("La cita se eliminó correctamente");
  ui.imprimirCitas();
}

function cargarEdicion(cita) {
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  citaObjeto.mascota = mascota;
  citaObjeto.propietario = propietario;
  citaObjeto.telefono = telefono;
  citaObjeto.fecha = fecha;
  citaObjeto.hora = hora;
  citaObjeto.sintomas = sintomas;
  citaObjeto.id = id;

  formulario.querySelector(`button[type="submit"]`).textContent = "Guardar Cambios";
  editando = true;
}

// Cargar las citas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  administrarCitas.cargarCitas();
  ui.imprimirCitas();
});