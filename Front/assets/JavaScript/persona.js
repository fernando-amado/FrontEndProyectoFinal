const tabla = document.querySelector(".tbody");
const boton = document.getElementById("ButtonAdd");
const btnGuardarMateria = document.getElementById("ButtonAddEditar");

let inputNombre = document.getElementById("nombre");
let inputApellido = document.getElementById("apellido");
let inputDocumento = document.getElementById("documento");
let inputTipo = document.getElementById("tipoId");
let inputId = document.getElementById("idMaestro");

let documentoEditar = document.getElementById("documentoEditar");
let nombreEditar = document.getElementById("nombreEditar");
let apellidoEditar = document.getElementById("apellidoEditar");
let tipoIdEditar = document.getElementById("tipoIdEditar");
let estadoEditar = document.getElementById("estadoEditar");
let htmlLocation = window.location;
//const urlApi = "http://fercho12345-001-site1.itempurl.com";
const urlApi = "http://localhost:52811";
const urlHost="http://127.0.0.1:5500";
boton.addEventListener("click", () => {
	inputNombre = document.getElementById("nombre").value;
	inputApellido = document.getElementById("apellido").value;
	inputTipo = parseInt(document.getElementById("tipoId").value);
	inputDocumento = document.getElementById("documento").value;
	Agregar(inputNombre, inputApellido, inputTipo, inputDocumento);
});
console.log(window.location)
function listarPersona() {
	fetch(urlApi+"/api/Personas/ConsultarTodo")
		.then((response) => response.json())
		.then((personas) =>
			personas.forEach((persona) => {
				if (
					persona.Tp_Id == 1 &&
					htmlLocation == urlHost+"/views/alumnos.html"
				) {
					llenarTablaPersona(persona);
				} else if (
					persona.Tp_Id == 2 &&
					htmlLocation == urlHost+"/views/maestros.html"
				) {
					llenarTablaPersona(persona);
				}
			})
		);
}

function llenarTablaPersona(p) {
	let profe = document.createElement("tr");
console.log(p)
	profe.innerHTML += `<td> ${p.NDoc} </td>
  <td>  ${p.Nombres} </td>
  <td>  ${p.Apellidos} </td>
  <td>  ${p.TDoc_Id == 1 ? "CC" : "TI"}  </td>
  <td>  ${p.Activo ? "Activo" : "Inactivo"}  </td>`;
	profe.innerHTML += `<td class="tdBoton ">
  <button class="buttonEditar"onclick="AbrirEditar
	(${p.Id},
	${p.NDoc},
	'${p.Nombres}',
    '${p.Apellidos}',
    ${p.TDoc_Id},
	${p.Activo}
	)">Editar</button>
  <button class="buttonEliminar" onclick="ConfirmarEliminar(${p.Id})">Eliminar</button></td>`;
	profe.setAttribute("data-id", p.Id);
	tabla.appendChild(profe);
	inputNombre.value = "";
}

function Capitalize(name) {
	return name
		? name[0].toUpperCase() + name.slice(1)
		: console.log("esta vacio");
}

function Agregar(nombre, apellido, tdoc, ndoc) {
	fetch(urlApi+"/api/Personas", {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		method: "POST",
		body: JSON.stringify({
			Nombres: Capitalize(nombre),
			Apellidos: Capitalize(apellido),
			TDoc_Id: tdoc,
			NDoc: ndoc,
			Activo: true,
			Tp_Id: htmlLocation == urlHost+"/views/alumnos.html" ? 1 : 2
		})
	}).then((response) => {
		if (response.status == 400) {
			swal(
				"¡Transaccion Fallida! ",
				"-Error el documento esta repetido \n -Campos Vacios",
				"error"
			);
		} else {
			swal(
				"¡Transaccion Exitosa! ",
				"¡Se ha agregado un nuevo alumno! ",
				"success"
			);
			response.json().then((a) => {
				llenarTablaPersona(a);
			});
		}
	});
}

function AbrirEditar(id, nDoc, nombres, apellidos, tDoc, estado) {
	OpenUpdate();
	documentoEditar.value = nDoc;
	nombreEditar.value = nombres;
	apellidoEditar.value = apellidos;
	tipoIdEditar.value = tDoc;
	estadoEditar.value = estado;
	btnGuardarMateria.addEventListener("click", () => {
		Editar(
			id,
			documentoEditar.value,
			nombreEditar.value,
			apellidoEditar.value,
			tipoIdEditar.value,
			estadoEditar.value
		);
	});
}

function Editar(id, nDoc, nombres, apellidos, tDoc, estado) {
	if (
		nombre == "" ||
		apellidos == "" ||
		tDoc == "" ||
		nDoc == "" ||
		estado == ""
	) {
		swal("¡Transaccion Fallida! ", "Diligencie todos los campos", "error");
	} else {
		fetch(urlApi+"/api/Personas/" + id, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			method: "PUT",
			body: JSON.stringify({
				Id: id,
				Nombres: nombres,
				Apellidos: apellidos,
				Tdoc_Id: parseInt(tDoc),
				NDoc: nDoc,
				Activo: estado == "1" ? true : false,

				Tp_Id: htmlLocation == urlHost+"/views/alumnos.html" ? 1 : 2
			})
		})
			.then((response) => {
				if (response.status == 400) {
					swal(
						"¡Transaccion Fallida! ",
						"-Error el documento esta repetido \n -Campos Vacios",
						"error"
					);
				} else {
					swal(
						"¡Transaccion Exitosa! ",
						"¡Se ha agregado un nuevo alumno! ",
						"success"
					);

					let tr = document.querySelector(`tr[data-id="${id}"]`);

					tr.innerHTML = `<td> ${nDoc} </td>
				<td>  ${nombres} </td>
				<td>  ${apellidos} </td>
				<td>  ${tDoc == 1 ? "CC" : "TI"}  </td>
				<td>  ${estado == "1" ? "Activo" : "Inactivo"}  </td>
				<td class="tdBoton ">
				<button class="buttonEditar" onclick="AbrirEditar
					(${id},
					${nDoc},
					'${nombres}',
					'${apellidos}',
					${tDoc},
					${estado}
					)">Editar</button>
				<button class=" buttonEliminar" onclick="ConfirmarEliminar(${id})">Eliminar</button></td>`;
				}
			})
			.catch((error) => {
				console.error(error);
			});
		CloseUpdate();
	}
}

function Eliminar(id) {
	ConfirmarEliminar();
	fetch(urlApi+"/api/Personas/" + id, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		method: "DELETE",
		body: JSON.stringify({
			Id: parseInt(id)
		})
	}).then((response) => {
		if (response.status == 400) {
			swal("¡Transaccion Fallida! ", "Persona asignado a una materia", "error");
		} else {
			let tr = document.querySelector(`tr[data-id="${id}"]`);
			tabla.removeChild(tr);
		}
	});
}

function ConfirmarEliminar(id) {
	swal({
		title: "Esta seguro de eliminar esta persona?",
		text:
			"No podra recuperar la información de esta persona si lo elimina y por favor verifique que la persona no tenga una materia asiganda",
		icon: "warning",
		buttons: true,
		dangerMode: true
	}).then((willDelete) => {
		if (willDelete) {
			Eliminar(id);
			swal("La persona ha sido eliminado correctamente", {
				icon: "success"
			});
		} else {
			swal("No se elimino la persona");
		}
	});
}
listarPersona();

