const tabla = document.querySelector(".tbody");
const notaNull = document.getElementById("notaNull");
const boton = document.getElementById("ButtonAdd");
const btnEditarPersona = document.querySelector("#ButtonAddEditar");
const idMateriaPersona = document.getElementById("idMateriaPersona");
const MateriaEditar = document.getElementById("MateriaEditar");
const EditarNota = document.getElementById("EditarNota");
const nombrePersona = document.getElementById("nombrePersona");
const nombreMateria = document.getElementById("nombreMateria");
const personaEditar = document.getElementById("personaEditar");
const htmlLocation = window.location.href;
const arrayMateria = [];
let arrayalumnos=[]
// const urlApi = "http://fercho12345-001-site1.itempurl.com";
const urlApi = "http://localhost:52811";
const urlHost="http://127.0.0.1:5500";

function seleccionarMateria(select) {
  fetch(urlApi+"/api/Materias")
    .then((response) => response.json())
    .then((materias) =>
      materias.forEach((materia) => {
        select.innerHTML += `<option value = ${materia.Id}>  ${materia.Nombre}    </option>`;
      })
    );
}
function seleccionarPersona(select) {
  fetch(urlApi+"/api/Personas/ConsultarTodo")
    .then((response) => response.json())
    .then((personas) =>
      personas.forEach((persona) => {
        if (persona.Tp_Id == 2 && htmlLocation == urlHost+"/views/asignar_materia_profesor.html" && persona.Activo) 
        {
          select.innerHTML += `<option value = ${persona.Id}>  ${persona.Nombres} ${persona.Apellidos} </option>`;
        }else if(persona.Tp_Id == 1 && htmlLocation == urlHost+"/views/asignar_materia_alumno.html" && persona.Activo){
          select.innerHTML += `<option value = ${persona.Id}>  ${persona.Nombres} ${persona.Apellidos} </option>`; 
		  arrayalumnos.push(persona)
        }
      })
    );
}
async function consultar() {
  await fetch(urlApi+"/api/PersonaMaterias")
    .then((response) => response.json())
    .then((materias) => {
      llenarTabla(materias);
    })
    .catch((error) => error);
}
function llenarTabla(materias) {
  html = " ";
  materias.forEach((materia) => {
    arrayMateria.push(materia)
    if (
      materia.TipoPersona == 2 &&
      htmlLocation ==
        urlHost+"/views/asignar_materia_profesor.html"
    ) {
      html += `<tr id="tr" data-id="${materia.Id}">
          <td>${materia.NombrePersona}  ${materia.ApellidoPersona}</td>
          <td>${materia.Materia}</td>

          <td class="tdBoton "><button class="buttonEditar "onclick="AbrirEditar('${materia.Id}','${materia.IdPersona}', '${materia.IdMateria}')">Editar</button>
    	  <button class=" buttonEliminar" onclick="ConfirmarEliminar(${materia.Id})">Eliminar</button></td>

          </tr>`;
          tabla.innerHTML = html;
    } else if(materia.TipoPersona == 1 && htmlLocation == urlHost+"/views/asignar_materia_alumno.html"){
      html += `<tr id="tr" data-id="${materia.Id}">
          <td>${materia.NombrePersona}  ${materia.ApellidoPersona}</td>
          <td>${materia.Materia}</td>

          <td class="tdBoton "><button class="buttonEditar "onclick="AbrirEditar('${materia.Id}','${materia.IdPersona}', '${materia.IdMateria}')">Editar</button>
    	  <button class=" buttonEliminar" onclick="ConfirmarEliminar(${materia.Id})">Eliminar</button></td>


          </tr>`;
      tabla.innerHTML = html;
    }
  });
}
function Agregar(Persona, Materia) {
	fetch(urlApi+"/api/PersonaMaterias", {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		method: "POST",
		body: JSON.stringify({
			Persona_Id: Persona,
			Materia_Id: Materia,
			Notas_Materias_Id: null
		})
	})
		.then((response) => {
			if(response.status == 400){
			swal("¡Transacción Fallida! " , "¡Verifique que los campos esten completos! " , "error")
		}else{
			response.json().then((data) => {
				swal ( "¡Transacción Exitosa! " , "¡Se ha asignado la materia al docente! " , "success" );
				consultar(data)}, limpiarDatos())
				nombrePersona.value = "";
				nombreMateria.value = "";
		}
	})	
}
function AbrirEditar(Id, persona, Materia) {
	OpenUpdate();
	idMateriaPersona.value = Id;
	personaEditar.value = persona;
	MateriaEditar.value = Materia;
}
function Editar(id, Persona, Materia) {

fetch(urlApi+"/api/PersonaMaterias/" + id, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		method: "PUT",
		body: JSON.stringify({
			Id: parseInt(id),
			Persona_Id: Persona,
			Materia_Id: Materia
		})
	}).then((data) => {
		llenarTabla(data),
		swal(
			"¡Transacción Exitosa! ",
			"¡Se ha editado la asignación! ",
			"success"
		);
		// let tr = document.querySelector(`tr[data-id="${id}"]`)
		// tr.innerHTML=`<td>${alumnos[0].Nombres}</td>
		// <td>${materias[0].Materia}</td>`
	})
		CloseUpdate();
}
function Eliminar(id) {
	ConfirmarEliminar();
	fetch(urlApi+"/api/PersonaMaterias/" + id, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		method: "DELETE",
		body: JSON.stringify({
			Id: parseInt(id)
		})
	}).then(() => {
		let tr = document.querySelector(`tr[data-id="${id}"]`);
		tabla.removeChild(tr);

	});
}
function ConfirmarEliminar(id){
	swal({
		title: "¿Esta seguro de eliminar la persona?",
		text: "No podra recuperar la información de la persona si lo elimina",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	  })
	  .then((willDelete) => {
		if (willDelete) {
			Eliminar(id);
		  swal("El docente ha eliminado la asignación correctamente", {
			icon: "success",
		  });
		} else {
		  swal("No se elimino el docente");
		}
	  });
}
function validarRepeticion(idP,idM){
  console.log("funcion sirve");
  (arrayMateria.some(personaMateria => ((personaMateria.IdPersona == idP) && (personaMateria.IdMateria == idM))) == true) ? 
  swal("¡Transacción Fallida! ", "-No puedes agregar esta persona porque ya tiene asignada una materia", "error")
  : Agregar(idP, idM),
  console.log('siempre se ejectua esto despues del trinario')
}
consultar();
seleccionarPersona(nombrePersona);
seleccionarMateria(nombreMateria);
seleccionarPersona(personaEditar);
seleccionarMateria(MateriaEditar);
boton.addEventListener("click", () => {
  validarRepeticion(nombrePersona.value, nombreMateria.value)
});
btnEditarPersona.addEventListener("click", () => {
  (arrayMateria.some(personaMateria => ((personaMateria.IdPersona == personaEditar.value) && (personaMateria.IdMateria == MateriaEditar.value))) == true) ? 
  swal("¡Transacción Fallida! ", "-No puedes editar esta persona porque ya tiene esa materia asignada", "error")
  :	Editar(idMateriaPersona.value, personaEditar.value, MateriaEditar.value);
});

