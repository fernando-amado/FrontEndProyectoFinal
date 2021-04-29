let imagenes = [
  "assets/img/Colegio1.png",
  "assets/img/Colegio2.jpg",
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
