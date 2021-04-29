const tabla = document.querySelector(".tbody");
const boton = document.getElementById("ButtonAdd");
const inputNombre = document.getElementById("nombre");
const inputId = document.getElementById("idPeriodo");
const nombreEditar = document.getElementById("nombreEditar");
const btnGuardarPeriodo = document.getElementById("ButtonAddEditar");
const porcentajePeriodo = document.getElementById("porcentaje")
const PorcentajeEditar=document.getElementById("PorcentajeEditar");
let otrosporcentajes =[]
let totalArregloPorcentaje=0;
const urlApi = "http://fercho12345-001-site1.itempurl.com";
const urlHost = "http://localhost:52811"
//const urlApi = "https://localhost:44351";

boton.addEventListener("click", () => {
	if(inputNombre.value == "" 
	|| inputNombre.value == null || inputNombre.value == undefined || parseInt(porcentaje.value) <=0
	|| porcentaje.value == null || porcentaje.value == undefined){
	swal(
        "¡Transaccion Fallida! ",
        "-Error el porcentaje es incorrecto \n -Campos Vacios",
        "error"
    );}else
	{Agregar(inputNombre.value,porcentaje.value)};
});
btnGuardarPeriodo.addEventListener("click", () => {
	Editar(inputId.value, nombreEditar.value,PorcentajeEditar.value);
});

function listarPeriodo() {
	fetch(urlHost+"/api/Periodoes")
		.then((response) => response.json())
		.then((periodos) =>
			periodos.forEach((periodo) => {
				llenarTabla(periodo);
			})
		);
}

function llenarTabla(m) {
	let nMateria = document.createElement("tr");

	nMateria.innerHTML += `<td>${m.NombreP} </td>
	<td>${m.Porcentaje}% </td>`;
	otrosporcentajes.push(m.Porcentaje)
	totalArregloPorcentaje=otrosporcentajes.reduce(function(a, b){ return a + b; })
	nMateria.setAttribute("data-id", m.Id);
	nMateria.innerHTML += `<td class="tdBoton "><button class="buttonEditar "onclick="AbrirEditar(${m.Id},'${m.NombreP}',${m.Porcentaje})">Editar</button>
    <button class=" buttonEliminar" onclick="ConfirmarEliminar(${m.Id})">Eliminar</button></td>`;
	tabla.appendChild(nMateria);
	inputNombre.value = "";
}

function Agregar(nombre,porcentaje) {
	fetch(urlHost +"/api/Periodoes", {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		method: "POST",
		body: JSON.stringify({
			NombreP: nombre,
			Porcentaje: porcentaje
		})
	})
		.then((response) => {
			if (response.status==400) {
				swal ( "¡Transaccion Fallida! " ,"Error Campos Vacios", "error" );
			}else {
				swal ( "¡Transaccion Exitosa! " , "¡Se ha agregado un nuevo Periodo! " , "success" );
				response.json().then((response)=>llenarTabla(response))
			}
		})
		
}

function AbrirEditar(id, nombre,porcentaje) {
	OpenUpdate();
	inputId.value = id;
	nombreEditar.value = nombre;
	PorcentajeEditar.value=porcentaje
}

function Editar(id, nombre,porcentaje) {
	fetch(urlHost+"/api/Periodoes/" + id, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		method: "PUT",
		body: JSON.stringify({
			Id: parseInt(id),
			NombreP: nombre,
			Porcentaje: parseFloat(porcentaje)
		})
	}).then(() => {
		let tr = document.querySelector(`tr[data-id="${id}"]`);

		tr.innerHTML = `<td>${nombre}</td><td>${porcentaje}%</td><td class="tdBoton "><button class="buttonEditar"onclick="AbrirEditar(${id},'${nombre}')">Editar</button>
    <button class=" buttonEliminar" onclick="Eliminar(${id})">Eliminar</button></td>`;
	}),
		limpiarDatos(),
		CloseUpdate();
}

function Eliminar(id) {
	fetch(urlHost+"/api/Periodoes/" + id, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		method: "DELETE",
		body: JSON.stringify({
			Id: parseInt(id)
		})
	}).then((response) => {
			let tr = document.querySelector(`tr[data-id="${id}"]`);
		tabla.removeChild(tr);
		inputId.value = "";
		inputNombre.value = "";
		}
		
	);
}

function ConfirmarEliminar(id){
	swal({
		title: "Esta seguro de eliminar esta periodo?",
		text: "No podra recuperar la información de esta persona si lo elimina y por favor verifique que no existan notas asiganadas a este periodo",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	  })
	  .then((willDelete) => {
		if (willDelete) {
			Eliminar(id);
		  swal("El periodo ha sido eliminado correctamente", {
			icon: "success",
		  });
		} else {
		  swal("No se elimino el periodo");
		}
	  });
}

porcentajePeriodo.addEventListener("keyup",()=>{validarPorcentaje(porcentajePeriodo)})

PorcentajeEditar.addEventListener("keyup",()=>{validarPorcentaje(PorcentajeEditar) })
function validarPorcentaje(porcentajePeriodo){
  if (parseFloat(porcentajePeriodo.value) + totalArregloPorcentaje<101){
    document.getElementById("grupo__nota").classList.add("formulario__grupo-correcto");
    document.getElementById("grupo__nota").classList.remove("formulario__grupo-incorrecto");
    document.querySelector(`#grupo__nota i`).classList.add('fa-check-circle');
    document.querySelector(`#grupo__nota i`).classList.remove('fa-times-circle');
    document.getElementById("ButtonAdd").disabled=false;
    document.getElementById("ButtonAdd").style.backgroundColor="#023859"
    
    
  }else{
   document.getElementById(`grupo__nota`).classList.add("formulario__grupo-incorrecto");
   document.getElementById(`grupo__nota`).classList.remove("formulario__grupo-correcto");
   document.querySelector(` #grupo__nota i`).classList.add('fa-times-circle');
   document.querySelector(`#grupo__nota i`).classList.remove('fa-check-circle'); 
   document.getElementById("ButtonAdd").disabled=true;
    document.getElementById("ButtonAdd").style.backgroundColor="#658294"
   
  }
}


listarPeriodo();
