//modal -------------------------------------------------

function limpiarDatos() {
  document.querySelector(".frmEditar").reset();
}
function OpenUpdate() {
  let modal = document.querySelector(".modalUpdate");

  modal.style.display = "block";
}
function CloseUpdate() {
  let modal = document.querySelector(".modalUpdate");
  modal.style.display = "none";
}

//buscar -------------------------------------------------

(function (document) {
  "use strict";

  var LightTableFilter = (function (Arr) {
    var _input;

    function _onInputEvent(e) {
      _input = e.target;
      var tables = document.getElementsByClassName(
        _input.getAttribute("data-table")
      );
      Arr.forEach.call(tables, function (table) {
        Arr.forEach.call(table.tBodies, function (tbody) {
          Arr.forEach.call(tbody.rows, _filter);
        });
      });
    }

    function _filter(row) {
      var text = row.textContent.toLowerCase(),
        val = _input.value.toLowerCase();
      row.style.display = text.indexOf(val) === -1 ? "none" : "table-row";
    }

    return {
      init: function () {
        var inputs = document.getElementsByClassName("light-table-filter");
        Arr.forEach.call(inputs, function (input) {
          input.oninput = _onInputEvent;
        });
      },
    };
  })(Array.prototype);

  document.addEventListener("readystatechange", function () {
    if (document.readyState === "complete") {
      LightTableFilter.init();
    }
  });
})(document);

//menu
let botonMenu = document.querySelector(".hamburguesa");
let ver = document.querySelectorAll(".ver");
botonMenu.addEventListener("click", MostrarNav);

function MostrarNav() {
  if (botonMenu) {
    ver.forEach((mostrar) => {
      mostrar.classList.toggle("hidden");
    });
  } else {
    alert("error");
  }
}
//logica img -------------------------------------------------
let hmtlLocation = window.location.toString();



function logicaImg(){let imagenes = [
  "assets/img/Colegio1.png",
  "assets/img/Colegio2.jpeg",
  "assets/img/Colegio3.jpg",
];
let slide = document.querySelector(".imgIndexSlide");
let botones = document.querySelectorAll(".ContentButtons");
botones[0].style.backgroundColor = "#3A6D8C";

let posicionActual = 0;
function SlideBotones(n) {
  posicionActual = n;
  MostrarImagen();
  ColorearBotones();
}
function AdelantarDatos() {
  posicionActual >= imagenes.length - 1
    ? (posicionActual = 0)
    : posicionActual++;
  MostrarImagen();
  ColorearBotones();
}

function RetrocederDatos() {
  posicionActual <= 0
    ? (posicionActual = imagenes.length - 1)
    : posicionActual--;
  MostrarImagen();
  ColorearBotones();
}
function MostrarImagen() {
  slide.src = `${imagenes[posicionActual]}`;
}
function ColorearBotones() {
  for (let i = 0; i < botones.length; i++) {
    if (i == posicionActual) {
      botones[posicionActual].style.backgroundColor = "#3A6D8C";
    } else {
      botones[i].style.backgroundColor = "#F2F2F2";
    }
  }
}
}

const formulario = document.getElementById("formulario");
const inputs = document.querySelectorAll("#formulario input");

const expresiones ={
    nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    apellido: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    nota: /^\d{1,3}$/, //Solo numeros del 0 al 5.
    documento: /^\d{7,10}$/ //Solo numeros.s
}



const campos = {
       nombre : false,
       apellido : false,
       documento : false
}


const validarFormulario = (e) =>{
       switch (e.target.name){
              case "nombre":
                     validarCampo(expresiones.nombre, e.target, 'nombre')
              break;
              case "apellido":
                     validarCampo(expresiones.apellido, e.target, 'apellido')
              break;
              case "documento":
                     validarCampo(expresiones.documento, e.target, 'documento')
              break;
       }
}




const validarCampo = (expresion, input, campo) => {
       if(expresion.test(input.value)){
              document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-incorrecto");
              document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-correcto");
              document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
              document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
              document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo')                   
              campos[campo] = true;
              document.getElementById("ButtonAdd").disabled=false;
              document.getElementById("ButtonAdd").style.backgroundColor="#023859"
              
       }else{
              document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-incorrecto");
              document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-correcto");
              document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
              document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle'); 
              document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo')
              campos[campo] = false;
              document.getElementById("ButtonAdd").disabled=true;
              document.getElementById("ButtonAdd").style.backgroundColor="#658294"
       }
}


inputs.forEach((input) =>{
       input.addEventListener('keyup', validarFormulario);
       input.addEventListener('blur', validarFormulario);
});

