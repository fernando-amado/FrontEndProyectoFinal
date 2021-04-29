//Se obtiene el id de la persona que llega desde la URL
const valores = window.location.search;
const urlParams = new URLSearchParams(valores);
let id = parseInt(urlParams.get('id'));
let idnotas =[]
let nombreAlumno = document.getElementById("NombreEstudiante")
let documento = document.getElementById("identificacion")
let tipoDoc = document.getElementById("tipoDocumento")
const tabla = document.querySelector(".TablaReporte");
//const urlApi = "http://fercho12345-001-site1.itempurl.com";
const urlApi = "http://localhost:52811";
let promedio=[]
async function listarNotas(a) {
    await fetch(urlApi+"/api/Personas/"+a)
        .then((data) => data.json())
        .then((notas) => {
            llenarTabla(notas)
        })
        .catch((error) => error);
}
function llenarTabla(notas) {
    html = " ";
    if(notas.length!=0){
        notas.forEach((n) => {
            if(!idnotas.includes(n.Notas[0].Idnota)){
                idnotas.push(n.Notas[0].Idnota);
                nombreAlumno.innerHTML = n.Nombre+" "+n.Apellidos;
                documento.innerHTML = n.NumeroDocumento;
                tipoDoc.innerHTML = n.Tipodedocumento;
                html += "<thead> <tr> <th>Nombre del Docente</th> <th>Materia</th> "
                for (let index = 0; index < n.Notas.length; index++) {
                    html+="<th>"+n.Notas[index].NombreP+"</th>";
                    promedio.push((n.Notas[index].Porcentaje /100) * n.Notas[index].Notas )
                }
                
                html+="<th>Nota Final</th></tr> </thead>"
                html+=`<tbody class="tbody">
                <tr id="tr" data-id="${n.Id}">
                    <td id="info">${n.Profesor[0].Nombres}</td>
                    <td id="info">${n.Materia}</td> `
                for (let index = 0; index < n.Notas.length; index++) {
                    
                    html+=`<td id="infoNotas">${(n.Notas[index]==null||n.Notas[index]==undefined)?"Aún no tiene nota asignada":n.Notas[index].Notas}</td>`
                    
                }
                let resultado=(promedio.reduce(function(a, b){ return a + b; })).toFixed(2)
                html+=`<td id="infoNotas">${resultado} </td>
                    </tr>`
                tabla.innerHTML = html;
            }
            
        })}else{
            alert("Alumno sin notas");
            window.close();
            
        }
}

listarNotas(id)
function Imprimir(){
    window.print();
}