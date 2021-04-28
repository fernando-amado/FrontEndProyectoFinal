const tabla = document.querySelector(".tbodyNotas");
const thead= document.querySelector(".theadNotas")


const selectestudiante = document.getElementById("estudiante");
const selectmateria = document.getElementById("materia");
const selectPeriodo = document.getElementById("Periodo");
const inputnota = document.getElementById("nota");
const btnagregar = document.getElementById("ButtonAdd");
const nombreEditar = document.getElementById("nombreEditar");
const materiaEditar = document.getElementById("materiaEditar");
const EditarNota = document.getElementById("EditarNota");
const periodoeditar = document.getElementById("seleccionPeriodo");
const btnEditar = document.getElementById("ButtonEditar");
let th;
let conteoTh=0;
let arrayperiodos=[];
const urlApi = "http://fercho12345-001-site1.itempurl.com";


function listarSelect(alumnmo){
    selectmateria.innerHTML =" "
    fetch(urlApi+"/api/Personas/"+alumnmo)
    .then((data)=>data.json())
    .then((notas)=>notas.forEach(materia=>{
        if(materia.Id == alumnmo){
        llenarSelect(materia,selectmateria)
        }
    }))
}

function listarSelectPeriodo(url, input) {
  fetch(url)
    .then((data) => data.json())
    .then((notas) =>
      notas.forEach((nota) => {
        llenarSelectPeriodo(nota, input);
      })
    );
}

function listarThead(url) {
    fetch(url)
      .then((data) => data.json())
      .then((notas) =>
        notas.forEach((nota) => {
          arrayperiodos.push(nota)
          theadperiodos(arrayperiodos)
          listarNotas(arrayperiodos);
        })
      );
  }

function listarSelectAlumno(url, input) {
  fetch(url)
    .then((data) => data.json())
    .then((notas) =>
      notas.forEach((nota) => {
        llenarSelectAlumno(nota, input);
      })
    );
}

btnagregar.addEventListener("click", () => {
  Agregar(
    selectestudiante.value,
    selectmateria.value,
    selectPeriodo.value,
    inputnota.value
  );
});

async function listarNotas(arrayperiodos) {
  await fetch(urlApi+"/api/Personas/ConsultarMultitabla")
    .then((data) => data.json())
    .then((notas) => {
     llenarTabla(notas,arrayperiodos.length); 

    })
    .catch((error) => error);
}

function llenarSelect(datos,input){
input.innerHTML += `<option value="${datos.Materia_id}">${datos.Materia}</option>`;
    
}

function llenarSelectPeriodo(datos, input) {
  input.innerHTML += `<option value="${datos.Id}">${datos.NombreP} (${datos.Porcentaje}%)</option>`;
}

function llenarSelectAlumno(datos, input) {
  if (datos.Tp_Id == 1 && datos.Activo) {
    input.innerHTML += `<option value="${datos.Id}">${datos.Nombres} ${datos.Apellidos}</option>`;
  }
}



function theadperiodos(array) {
  let html = ""  
  html += `<tr>
  <th class="th" >Nombre del Estudiante</th>
      <th class="th">Materia</th>`;
      
      array.forEach(p => {
        html += `<th class="th">Nota ${p.NombreP} Periodo</th>`;
        
      });
  html += `<th class="th">Acción</th></tr>`;
  thead.innerHTML=html;
    th = document.querySelectorAll(".th");

	
}
// if (!idnotas.includes(n.Notas[0].Idnota)) {
// 	idnotas.push(n.Notas[0].Idnota);

// 	html += `<tr id="tr" data-id="${n.Id}">
//           <td>${n.Nombre}  ${n.Apellidos}</td>
//           <td>${n.Materia}</td>
//            <td>${
// 							n.Notas[0] == null || n.Notas == undefined
// 								? "Aún no tiene nota asignada"
// 								: n.Notas[0].Notas
// 						}</td>
//             <td>${
// 							n.Notas[1] == null || n.Notas[1] == undefined
// 								? "Aún no tiene nota asignada"
// 								: n.Notas[1].Notas
// 						}</td>
//           <td class="tdBoton "><button class="buttonEditar far fa-edit"
//     onclick="AbrirEditar(${n.Notas[0].Idnota},${
// 		n.Notas[1] == null || n.Notas[1] == undefined ? 0 : n.Notas[1].Idnota
// 	},'${n.Nombre}','${n.Notas[0].Notas}','${
// 		n.Notas[1] == null || n.Notas[1] == undefined
// 			? "Aún no tiene nota asignada"
// 			: n.Notas[1].Notas
// 	}','${n.Materia}')">Editar</button>
//     <button class=" fas fa-trash-alt buttonEliminar" onclick="ConfirmarEliminar(${
// 			n.Id
// 		},${n.Materia_id},${n.Notas[0].Idnota},${
// 		n.Notas[1] == null || n.Notas[1] == undefined ? 0 : n.Notas[1].Idnota
// 	})">Eliminar</button></td>
//           </tr>`;
// 	tabla.innerHTML = html;
// } else {
// 	console.log("holaa");
// }

function llenarArrayNotas(datos){
  
  datos.forEach((nota) => arrayTodasLasNotas.push(nota.Notas));

}

function llenarTabla(notas,arrayperiodos) {

   let html = " ";
   console.log(arrayperiodos);
   
		for (let i = 0; i < notas.length; i++) {
       let contador = 0;
      for (let j = 0; j < notas[i].Materias.length; j++) {
        html += `<tr data-id="${notas[i].Id}">
        <td>${notas[i].Nombre}</td>
        <td>${notas[i].Materias[j].Nombre}</td>`
for (let l = 0; l < arrayperiodos; l++) {

		let notaPersona = notas[i].Materias[j].Notas[l]?.nota;

		console.log(notaPersona);

		html += ` <td>${
			notaPersona == null || notaPersona == undefined ? "N.N" : notaPersona
		}</td>`;
		contador++;
 
  
}
      
       
      }
         html += `</tr>`;
			tabla.innerHTML = html;
		}
  
}


function Agregar(nombre, materia, periodo, nota) {
  fetch(urlApi+"/api/NotasMaterias", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      Notas: nota,
      Periodo_id: periodo,
      Materia_id: materia,
      Estudiante_id: nombre,
    }),
  })
    .then((response) => response.json())
    .then();
  swal(
    "¡Transaccion Exitosa! ",
    "¡Se han agregado las notas al alumno! ",
    "success"
  );
  setInterval("actualizar()", 30000);
  selectestudiante.value = "";
  selectmateria.value = "";
  selectPeriodo.value = "";
  inputnota.value = "";
}

function AbrirEditar(idnota,nombre,materia,nota) {
 
// console.log(arrayTodasLasNotas[0])

 console.log(nota);
  OpenUpdate();
  document.getElementById("nombreEditar").value = nombre;

  document.getElementById("idnota").value = idnota;
  document.getElementById("materiaEditar").value = materia;

  periodoeditar.addEventListener("change", () => {
    if (periodoeditar.value == 1) {
      document.getElementById("idnota").value = idnota1;
      document.getElementById("EditarNota").value = nota1;
    } else if (periodoeditar.value == 2) {
      document.getElementById("idnota").value = idnota2;
      document.getElementById("EditarNota").value = nota2;
    }
  });
}
function actualizar() {
  location.reload(true);
}
function Editar(id, periodo, nota) {
  fetch(urlApi+"/api/NotasMaterias/" + id, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({
      Id: parseInt(id),
      Notas: nota,
      Periodo_id: parseInt(periodo),
    }),
  }).then((data) => {
    listarNotas(data);
  }),
    setInterval("actualizar()", 30);
  CloseUpdate();

  selectestudiante.value = "";
  selectmateria.value = "";
  selectPeriodo.value = "";
  inputnota.value = "";
}

function Eliminar(idpersona, idmateria, idnota1, idnota2) {
  fetch(urlApi+"/api/NotasMaterias/" + idnota1, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "DELETE",
    body: JSON.stringify({
      Id: parseInt(idnota1),
      Estudiante_id: parseInt(idpersona),
      Materia_id: parseInt(idmateria),
      Notas: parseInt(idnota2),
    }),
  })
    .then((response) => response)
    .then();
  let tr = document.querySelector(`tr[data-id="${idpersona}"]`);
  tabla.removeChild(tr);
}
function ConfirmarEliminar(idpersona, idmateria, idnota1, idnota2) {
  swal({
    title: "Esta seguro de eliminar el alumno?",
    text: "No podra recuperar la información del alumno si lo elimina",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      Eliminar(idpersona, idmateria, idnota1, idnota2);
      swal("El maestro ha sido eliminado correctamente", {
        icon: "success",
      });
    } else {
      swal("No se elimino el maestro");
    }
  });
}
btnEditar.addEventListener("click", () => {
  Editar(
    document.getElementById("idnota").value,
    periodoeditar.value,
    document.getElementById("EditarNota").value
  );
});
selectestudiante.addEventListener('change', function(event){
    listarSelect(event.target.value)
})


listarSelectAlumno(
	urlApi+"/api/Personas/ConsultarTodo",
	selectestudiante
);
listarSelectPeriodo(urlApi+"/api/Periodoes", selectPeriodo);
listarSelectPeriodo(urlApi+"/api/Periodoes", periodoeditar);
listarThead(urlApi+"/api/Periodoes");



