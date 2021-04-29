const tabla = document.querySelector(".tbodyNotas");

const inputnota = document.getElementById("nota");
const nombreEditar = document.getElementById("nombreEditar");
const materiaEditar = document.getElementById("materiaEditar");
const EditarNota = document.getElementById("EditarNota");
const periodoeditar = document.getElementById("seleccionPeriodo");
const btnEditar = document.getElementById("ButtonEditar");
let conteoTh=0;
let arrayperiodos=[];
// const urlApi = "http://fercho12345-001-site1.itempurl.com";
const urlApi = "http://localhost:52811";


function listarThead(url) {
    fetch(url)
      .then((data) => data.json())
      .then((periodos) => {
            theadperiodos(periodos);
            listarNotas(periodos);
          }
      );
  }



async function listarNotas(arrayperiodos) {
  await fetch(urlApi+"/api/Personas/alumnos/materias/notas")
    .then((data) => data.json())
    .then((notas) => {
     llenarTabla(notas, arrayperiodos); 
    })
    .catch((error) => error);
}

function theadperiodos(periodos) {
  const thead= document.querySelector(".theadNotas");
  let html = "" 
  const ConcatenarTh = function(html){
    return function(texto){
      return html += `<th class="th">${texto}</th>`;
    };
  }
  const iHtml = ConcatenarTh(html); 
  html += `<tr>`;
   iHtml("Nombre Estudiante") 
  iHtml("Materia") 
      periodos.forEach(p => {
         iHtml("Nota "+p.NombreP+" Periodo");
        
      });
   iHtml("Acción")
  html += `</tr>`;
  thead.innerHTML=html;	
}


function llenarArrayNotas(datos){
  
  datos.forEach((nota) => arrayTodasLasNotas.push(nota.Notas));

}
function validarArray(array, nuevo){
  let elementoEncontrado = array.find(function(item){
      return item.idPM == nuevo.idPM && item.idPeriodo == nuevo.idPeriodo
  })
  if(!!elementoEncontrado){
      elementoEncontrado.nota = nuevo.nota
  }else{
      array.push(nuevo)
  }
  return array;
}
function llenarTabla(notas, periodos) {
  function crearTd(texto) {
    let td = document.createElement("td");
    td.innerHTML=texto;
    return td;
  }
   let html = " ";
   console.log(notas)
   console.count()

   for (let i = 0; i < notas.length; i++) {
      let tr = document.createElement("tr");
      tr.setAttribute("data-id",notas[i].idPersona);
      tabla.appendChild(tr);

      tr.appendChild(crearTd(notas[i].nombrePersona));
      tr.appendChild(crearTd(notas[i].nombreMateria));
        for (let j = 0; j < periodos.length; j++) {
              let idPeriodo = periodos[j].Id;
              let notaPintar= notas[i].notasPersona[j]?.nota;
              let idnota= notas[i].notasPersona[j]?.idnota;
              let idPM= notas[i].idPM;
              let nota =notaPintar==undefined || notaPintar==null?"":notaPintar;
              let td_nota = crearTd("");
              let input_nota = document.createElement("input");
              input_nota.setAttribute("type","text");
              input_nota.value = nota;
              input_nota.addEventListener('keyup',function() {
                if(this.value != nota){
                  let cambiosActuales = JSON.parse(botonEditar.dataset.changes) ;
                  validarArray(cambiosActuales, {idNota: idnota, nota: this.value, idPM: idPM, idPeriodo: idPeriodo}); 
                  botonEditar.dataset.changes = JSON.stringify(cambiosActuales);
                  botonEditar.disabled = false; 

                }

                
              })

              td_nota.appendChild(input_nota);
              tr.appendChild(td_nota);
            }  

       let botonEditar=document.createElement("button");
       botonEditar.dataset.changes=JSON.stringify([]);
       botonEditar.classList.add("buttonEditar");
       botonEditar.innerHTML = "Guardar";
       botonEditar.disabled=true;
       botonEditar.addEventListener('click',function(){
        let cambios = JSON.parse(this.dataset.changes);
           cambios.forEach(function(item){
            if(!!item.idNota){
              Editar(item)
            }else{
              Agregar(item)
            }
           })
            
       });

       let acciones = crearTd("");
       acciones.appendChild(botonEditar)
      tr.appendChild(acciones)

   }
  
  
}

function Agregar(item) {
  fetch(urlApi+"/api/NotasMaterias", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      Notas: item.nota,
      PersonaMateriaId: parseInt(item.idPM),
      Periodo_id: parseInt(item.idPeriodo)
    })
  })
    .then((response) => response.json())
}

function Editar(item) {
  fetch(urlApi+"/api/NotasMaterias/" + item.idNota, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({
      Id: parseInt(item.idNota),
      Notas: item.nota,
      PersonaMateriaId: parseInt(item.idPM),
      Periodo_id: parseInt(item.idPeriodo)
    })
  }).then((data) => {
    window.location = window.location;
  })
}



listarThead(urlApi+"/api/Periodoes");



