let pomodoroTimer = document.querySelector(".pomodoroTimer");
let descansoCorto = document.querySelector(".descansoCorto");
let descansoLargo = document.querySelector(".descansoLargo");
let tiempo = document.querySelector(".tiempo");
let start = document.querySelector(".button-wrap");
let configuracion = document.querySelector(".config");
let rangoPomodoro = document.querySelector("#rangoPomodoro");
let rangoDescansoCorto = document.querySelector("#rangoDescansoCorto");
let rangoDescansoLargo = document.querySelector("#rangoDescansoLargo");
let configPomodoro = document.querySelector(".configPomodoro");
let configDescansoCorto = document.querySelector(".configDescansoCorto");
let configDescansoLargo = document.querySelector(".configDescansoLargo");
let reestablecer = document.querySelector(".reestablecer");
let borrarConteo = document.querySelector(".borrarConteo");
let musica = document.querySelectorAll("input[type='radio']");
let agregarLink = document.querySelector(".agregarLink");
let linkYouTube = document.querySelector("#linkYouTube");
let agregarTarea = document.querySelector(".agregarTarea");
let cancelarTarea = document.querySelector(".cancelarTarea");
let descripcionTarea = document.querySelector("#descripcionTarea");
let numPomodoros = document.querySelector("#numPomodoros");
let listGroup = document.querySelector(".list-group");
let listaTareasDinamica = document.querySelector(".listaDinamica");
let cerrarConfig = document.querySelector(".cerrarConfig");
let esconder = document.querySelector(".esconder");
let acumulados = document.querySelector(".acumulados");
let videoShow = document.querySelector(".videoShow");
let verVideo = document.querySelector(".verVideo");
let video = document.querySelector(".video");
let progressBar = document.querySelector(".progress-bar");
let on = document.querySelector(".on");
let off = document.querySelector(".off");

let flagConteo = null;
let pausa = false;
let minutos, segundos;

document.onload = relojes();
document.onload = setearReloj(localStorage.getItem("minutoPomodoro"));
document.onload = actualizarListaTareas();
document.onload = setMusica();

function relojes() {
  if (localStorage.getItem("minutoPomodoro") == null)
    localStorage.setItem("minutoPomodoro", 25);
  if (localStorage.getItem("minutoDescansoCorto") == null)
    localStorage.setItem("minutoDescansoCorto", 5);
  if (localStorage.getItem("minutoDescansoLargo") == null)
    localStorage.setItem("minutoDescansoLargo", 20);
  if (localStorage.getItem("conteoPomodoros") == null)
    localStorage.setItem("conteoPomodoros", 0);
  localStorage.setItem("pomodoroActivo", true);
  localStorage.setItem("minutosBarra", localStorage.getItem("minutoPomodoro"));
  actualizarConteoPomodoros();
}

/* EVENT LISTENERS */

agregarLink.addEventListener("click", function (event) {
  event.preventDefault();
  agregarLinkYouTube();
});

for (let index = 0; index < musica.length; index++) {
  musica[index].addEventListener("change", function (event) {
    event.preventDefault();
    cambiarMusica(event.target.id);
  });
}

borrarConteo.addEventListener("click", function (event) {
  event.preventDefault();
  borrarConteoPomodoros();
});

reestablecer.addEventListener("click", function (event) {
  event.preventDefault();
  reestablecerTiempos();
});

configuracion.addEventListener("click", function (event) {
  event.preventDefault();
  rangoPomodoro.value = localStorage.getItem("minutoPomodoro");
  configPomodoro.innerHTML = rangoPomodoro.value;
  rangoDescansoCorto.value = localStorage.getItem("minutoDescansoCorto");
  configDescansoCorto.innerHTML = rangoDescansoCorto.value;
  rangoDescansoLargo.value = localStorage.getItem("minutoDescansoLargo");
  configDescansoLargo.innerHTML = rangoDescansoLargo.value;
});

verVideo.addEventListener("click", function (event) {
  event.preventDefault();
  playVideo();
});

cerrarConfig.addEventListener("click", function (event) {
  event.preventDefault();
  eventoPomodoro();
});

listaTareasDinamica.addEventListener("click", function (e) {
  borrarTarea(e);
});

agregarTarea.addEventListener("click", function (event) {
  funcAgregarTarea(event);
});
cancelarTarea.addEventListener("click", function (event) {
  funcCancelarTarea(event);
});

pomodoroTimer.addEventListener("click", function (event) {
  event.preventDefault();
  eventoPomodoro();
});

descansoCorto.addEventListener("click", function (event) {
  event.preventDefault();
  eventoDescansoCorto();
});

descansoLargo.addEventListener("click", function (event) {
  event.preventDefault();
  eventoDescansoLargo();
});

start.addEventListener("click", function (event) {
  cuentaRegresiva(event);
  start.classList.toggle("button-active");
});

configPomodoro.innerHTML = rangoPomodoro.value;
rangoPomodoro.addEventListener("input", () => {
  configPomodoro.innerHTML = rangoPomodoro.value;
  localStorage.setItem("minutoPomodoro", rangoPomodoro.value);
});

configDescansoCorto.innerHTML = rangoDescansoCorto.value;
rangoDescansoCorto.addEventListener("input", () => {
  configDescansoCorto.innerHTML = rangoDescansoCorto.value;
  localStorage.setItem("minutoDescansoCorto", rangoDescansoCorto.value);
});

configDescansoLargo.innerHTML = rangoDescansoLargo.value;
rangoDescansoLargo.addEventListener("input", () => {
  configDescansoLargo.innerHTML = rangoDescansoLargo.value;
  localStorage.setItem("minutoDescansoLargo", rangoDescansoLargo.value);
});

/* FUNCIONES */

function actualizarConteoPomodoros() {
  let cant = localStorage.getItem("conteoPomodoros");
  acumulados.innerHTML = cant;
}

function agregarLinkYouTube() {
  let link = linkYouTube.value;
  linkYouTube.value = "";
  // linkYouTube.placeholder = "Listo! ¿Agregás otro?";
  if (localStorage.getItem("videosUsuario") == null) {
    localStorage.setItem("videosUsuario", "[]");
  }
  let arr = JSON.parse(localStorage.getItem("videosUsuario"));
  arr.push(link);
  localStorage.setItem("videosUsuario", JSON.stringify(arr));
}

function setMusica() {
  let id;
  if (localStorage.getItem("musica") == null) {
    id = "shuffle";
    localStorage.setItem("musica", id);
  } else {
    id = localStorage.getItem("musica");
  }
  for (let index = 0; index < musica.length; index++) {
    if (musica[index].id == id) {
      musica[index].checked = "checked";
    }
  }
}

function cambiarMusica(id) {
  localStorage.setItem("musica", id);
  for (let index = 0; index < musica.length; index++) {
    if (musica[index].id == id) {
      musica[index].checked = "checked";
    }
  }
}

function borrarConteoPomodoros() {
  localStorage.setItem("conteoPomodoros", 0);
  actualizarConteoPomodoros;
}

function reestablecerTiempos() {
  localStorage.setItem("minutoPomodoro", 25);
  localStorage.setItem("minutoDescansoCorto", 5);
  localStorage.setItem("minutoDescansoLargo", 20);
  rangoPomodoro.value = localStorage.getItem("minutoPomodoro");
  configPomodoro.innerHTML = rangoPomodoro.value;
  rangoDescansoCorto.value = localStorage.getItem("minutoDescansoCorto");
  configDescansoCorto.innerHTML = rangoDescansoCorto.value;
  rangoDescansoLargo.value = localStorage.getItem("minutoDescansoLargo");
  configDescansoLargo.innerHTML = rangoDescansoLargo.value;
}

function eventoPomodoro() {
  cambiarColorFondo("#e06148", "#e97a63", event);
  setearReloj(localStorage.getItem("minutoPomodoro"));
  localStorage.setItem("minutosBarra", localStorage.getItem("minutoPomodoro"));
  pararReloj();
  esconder.style.display = "block";
  videoShow.style.display = "none";
  video.style.display = "none";
  pomodoroTimer.style = "background-size: 100% 3px, auto;";
  descansoCorto.style = "background-size: 100% 0px, auto;";
  descansoLargo.style = "background-size: 100% 0px, auto;";
  localStorage.setItem("pomodoroActivo", true);
}

function eventoDescansoCorto() {
  cambiarColorFondo("#5092a1", "#6db0bf");
  setearReloj(localStorage.getItem("minutoDescansoCorto"));
  localStorage.setItem(
    "minutosBarra",
    localStorage.getItem("minutoDescansoCorto")
  );
  pararReloj();
  esconder.style.display = "none";
  videoShow.style.display = "block";
  pomodoroTimer.style = "background-size: 100% 0px, auto;";
  descansoCorto.style = "background-size: 100% 3px, auto;";
  descansoLargo.style = "background-size: 100% 0px, auto;";
  localStorage.setItem("pomodoroActivo", false);
}

function eventoDescansoLargo() {
  cambiarColorFondo("#50a170", "#72c492", event);
  setearReloj(localStorage.getItem("minutoDescansoLargo"));
  localStorage.setItem(
    "minutosBarra",
    localStorage.getItem("minutoDescansoLargo")
  );
  pararReloj();
  esconder.style.display = "none";
  videoShow.style.display = "block";
  pomodoroTimer.style = "background-size: 100% 0px, auto;";
  descansoCorto.style = "background-size: 100% 0px, auto;";
  descansoLargo.style = "background-size: 100% 3px, auto;";
  localStorage.setItem("pomodoroActivo", false);
}

function borrarTarea(e) {
  e.preventDefault();
  if (e.target.parentElement.classList.contains("delete-item")) {
    let arrTareas = JSON.parse(localStorage.getItem("tareas"));
    nuevoArr = arrTareas.filter((item) => item.id != e.target.parentElement.id);
    localStorage.setItem("tareas", JSON.stringify(nuevoArr));
    actualizarListaTareas();
  }
}

function cambiarColorFondo(color1, color2) {
  // e.preventDefault();
  document.querySelector(".primeraPagina").style.backgroundColor = color1;
  document.querySelector(".mainClock").style.backgroundColor = color2;
  document.querySelector(".barra").style.backgroundColor = color2;
}

function setearReloj(mins) {
  localStorage.setItem("segundo", 60);
  localStorage.setItem("minuto", mins - 1);
  tiempo.innerHTML = `<span>${mins}:00</span>`;
  actualizarListaTareas();
}

function funcAgregarTarea(e) {
  e.preventDefault();
  if (descripcionTarea.value != "" && numPomodoros.value != "") {
    let tarea = {
      nombre: descripcionTarea.value,
      cantPom: numPomodoros.value,
      terminados: 0,
    };
    guardarTareas(tarea);
    actualizarListaTareas();
    $("#agregarTarea").modal("hide");
    borrarModalTareas();
  }
}
function funcCancelarTarea(e) {
  e.preventDefault();
  borrarModalTareas();
}

function calcularTiempoPrimeraTarea(tarea) {
  let objeto = {
    horas: "",
    minutos: "",
    mins: "",
    cantPomodoros: "",
  };
  let time = new Date();
  objeto.horas = time.getHours();
  objeto.minutos = time.getMinutes();
  objeto.mins = 0;
  objeto.cantPomodoros = tarea.cantPom;
  for (let index = 1; index <= objeto.cantPomodoros; index++) {
    if (index == 1) objeto.mins += parseInt(localStorage.getItem("minuto")) + 1;
    else if (index == 5 || index == 9)
      objeto.mins +=
        parseInt(localStorage.getItem("minutoPomodoro")) +
        parseInt(localStorage.getItem("minutoDescansoLargo"));
    else
      objeto.mins +=
        parseInt(localStorage.getItem("minutoPomodoro")) +
        parseInt(localStorage.getItem("minutoDescansoCorto"));
  }
  while (objeto.mins > 0) {
    if (objeto.mins > 60) {
      objeto.mins -= 60;
      objeto.horas++;
    } else {
      objeto.minutos += objeto.mins;
      objeto.mins -= objeto.mins;
    }
  }
  if (objeto.minutos >= 60) {
    objeto.horas++;
    objeto.minutos -= 60;
  }
  if (objeto.horas >= 24) objeto.horas -= 24;
  tarea.tiempo = {
    horas: objeto.horas,
    minutos: objeto.minutos,
  };
  return tarea;
}

function calcularTiempoTarea(tarea, tareaAnterior) {
  let obj = tarea;
  obj.tiempo = { horas: 0, minutos: 0 };
  obj.tiempo.horas = tareaAnterior.tiempo.horas;
  obj.tiempo.minutos = tareaAnterior.tiempo.minutos;
  obj.mins = 0;
  for (let index = 1; index <= obj.cantPom; index++) {
    if (index == 5 || index == 9)
      obj.mins +=
        parseInt(localStorage.getItem("minutoPomodoro")) +
        parseInt(localStorage.getItem("minutoDescansoLargo"));
    else
      obj.mins +=
        parseInt(localStorage.getItem("minutoPomodoro")) +
        parseInt(localStorage.getItem("minutoDescansoCorto"));
  }
  while (obj.mins > 0) {
    if (obj.mins > 60) {
      obj.mins -= 60;
      obj.tiempo.horas++;
    } else {
      obj.tiempo.minutos += obj.mins;
      obj.mins -= obj.mins;
    }
  }
  if (obj.tiempo.minutos >= 60) {
    obj.tiempo.horas++;
    obj.tiempo.minutos -= 60;
  }
  if (obj.tiempo.horas >= 24) obj.tiempo.horas -= 24;
  return obj;
}

function actualizarListaTareas() {
  if (
    localStorage.getItem("tareas") != null &&
    localStorage.getItem("tareas") != "[]"
  ) {
    listaTareasDinamica.innerHTML = `
      <a class="list-group-item list-group-item-action">
      <div class="row m-0">
      <div class="col-6">Descripción</div>
      <div class="col-3">Pomodoros</div>
      <div class="col-3">Hora Fin</div>
      </div>
      </a>        
    `;
    let nuevaLista = [];
    let lista = JSON.parse(localStorage.getItem("tareas"));
    for (let index = 0; index < lista.length; index++) {
      if (index == 0) nuevaLista.push(calcularTiempoPrimeraTarea(lista[index]));
      else
        nuevaLista.push(
          calcularTiempoTarea(lista[index], nuevaLista[index - 1])
        );
    }
    localStorage.setItem("tareas", JSON.stringify(nuevaLista));
    lista = JSON.parse(localStorage.getItem("tareas"));
    let par = true;
    lista.forEach((item) => {
      par = !par;
      const taskItem = document.createElement("a");

      if (par)
        taskItem.className = "list-group-item list-group-item-action itemPar";
      else
        taskItem.className = "list-group-item list-group-item-action itemImpar";

      const fila = document.createElement("div");
      fila.className = "row m-0";

      const div1 = document.createElement("div");
      const div2 = document.createElement("div");
      const div3 = document.createElement("div");

      div1.className = "col-6 pt-2";
      div2.className = "col-3 pt-2";
      div3.className = "col-2 pt-2";

      let h =
        item.tiempo.horas > 9 ? item.tiempo.horas : `0${item.tiempo.horas}`;
      let m =
        item.tiempo.minutos > 9
          ? item.tiempo.minutos
          : `0${item.tiempo.minutos}`;
      div1.appendChild(document.createTextNode(item.nombre));
      div2.appendChild(
        document.createTextNode(`${item.terminados} / ${item.cantPom}`)
      );
      div3.appendChild(document.createTextNode(`${h}:${m}`));

      const cruz = document.createElement("a");
      cruz.className = "col-1 delete-item secondary-content pt-1 pl-1";
      cruz.innerHTML = '<i class = "fa fa-remove"></i>';
      cruz.setAttribute("id", item.id);

      fila.appendChild(div1);
      fila.appendChild(div2);
      fila.appendChild(div3);
      fila.appendChild(cruz);
      taskItem.appendChild(fila);

      listaTareasDinamica.appendChild(taskItem);
    });
  } else {
    listaTareasDinamica.innerHTML = "";
  }
}

//Función de guardar en memoria
function guardarTareas(tarea) {
  let listaTareas;
  if (
    localStorage.getItem("tareas") == undefined ||
    localStorage.getItem("tareas") == "[]"
  ) {
    listaTareas = [];
    tarea.id = 1;
  } else {
    listaTareas = JSON.parse(localStorage.getItem("tareas"));
    if (listaTareas != undefined || listaTareas != []) {
      let ultimaTarea = listaTareas[listaTareas.length - 1];
      tarea.id = ultimaTarea.id + 1;
    }
  }
  if (listaTareas.length > 5) {
    alert("Se alcanzó el máximo de tareas posibles :(");
  } else {
    listaTareas.push(tarea);
    localStorage.setItem("tareas", JSON.stringify(listaTareas));
  }
}

function borrarModalTareas() {
  descripcionTarea.value = "";
  numPomodoros.value = "";
}

function sumarPomodoro() {
  let cant = JSON.parse(localStorage.getItem("conteoPomodoros")) + 1;
  localStorage.setItem("conteoPomodoros", cant);
  actualizarConteoPomodoros();
  let arrTareas = JSON.parse(localStorage.getItem("tareas"));
  for (let index = 0; index < arrTareas.length; index++) {
    if (arrTareas[index].terminados < arrTareas[index].cantPom) {
      arrTareas[index].terminados++;
      break;
    }
  }
  localStorage.setItem("tareas", JSON.stringify(arrTareas));
  actualizarListaTareas();
}

function cuentaRegresiva(e) {
  e.preventDefault();
  pausa = !pausa;
  if (pausa) {
    on.currentTime = 0; //rebobina el audio a 0
    on.play();
  } else {
    off.currentTime = 0;
    off.play();
  }
  if (!flagConteo) {
    flagConteo = setInterval(() => {
      if (pausa) {
        segundos = localStorage.getItem("segundo");
        minutos = localStorage.getItem("minuto");
        if (segundos > 0) {
          segundos--;
          localStorage.setItem("segundo", segundos);
        } else {
          if ((minutos == 0) & (segundos == 0)) {
            if (JSON.parse(localStorage.getItem("pomodoroActivo"))) {
              sumarPomodoro();
              if (JSON.parse(localStorage.getItem("conteoPomodoros")) % 4 != 0)
                eventoDescansoCorto();
              else eventoDescansoLargo();
            } else {
              eventoPomodoro();
            }
            clearInterval(flagConteo);
            return;
          } else {
            minutos--;
            segundos = 59;
            localStorage.setItem("segundo", segundos);
            localStorage.setItem("minuto", minutos);
          }
        }
        accionBarra(minutos, segundos);
        let seg = segundos > 9 ? segundos.toString() : `0${segundos}`;
        tiempo.innerHTML = `<span>${minutos}:${seg}</span>`;
        document.title = `${minutos}:${seg} - PomoTimer!`;
      }
    }, 1000);
  }
  segundos = 60;
}

function accionBarra(minutos, segundos) {
  //por las dudas, hago un parse a los minutos y segundos, porque en el conteo no lo hago
  minutos = parseInt(minutos);
  segundos = parseInt(segundos);
  //traigo los minutos que serán el 100%, depende en qué timer esté parado
  tiempoBarra = JSON.parse(localStorage.getItem("minutosBarra"));
  //los convierto a segundos
  tiempoBarra *= 60;
  //hago un total de segundos del contador actual de tiempo
  minutos *= 60;
  minutos += segundos;
  //x es la cantidad de segundos actual que han pasado desde el inicio.
  x = tiempoBarra - minutos;
  //con x, saco el porcentaje de lo que realmente va de tiempo
  x = (x * 100) / tiempoBarra;
  //aplico ese porcentaje al width de la barra
  progressBar.style.width = `${x}%`;
}

function pararReloj() {
  if (flagConteo != null) {
    clearInterval(flagConteo);
    flagConteo = null;
  }
  document.title = "PomoTimer!";
  pausa = false;
  start.classList.remove("button-active");
  progressBar.style.width = `0%`;
}

const videosRock = [
  "ma9I9VBKPiw",
  "Ijk4j-r7qPA",
  "8DyziWtkfBw",
  "0J2QdDbelmY",
  "F90Cw4l-8NY",
  "ktvTqknDobU",
];

const videosPop = [
  "0k_1kvDh2UA",
  "hT_nvWreIhg",
  "CfihYWRWRTQ",
  "5NV6Rdv1a3I",
  "YNDVipmJfz8",
  "GzU8KqOY8YA",
];

const videosElectro = [
  "fDrTbLXHKu8",
  "JRfuAukYTKg",
  "6Cp6mKbRTQY",
  "gCYcHz2k5x0",
  "tpKCqp9CALQ",
];

// document.onload = playVideo();

function playVideo() {
  let arr = [];
  let estilo = localStorage.getItem("musica");
  video.style.display = "block";
  if (estilo == "shuffle") {
    if (localStorage.getItem("videosUsuario") != null) {
      let arrUsuario = JSON.parse(localStorage.getItem("videosUsuario"));
      arr = arr.concat(arrUsuario);
    }
    arr = arr.concat(videosRock).concat(videosPop).concat(videosElectro);
  } else if (estilo == "pop") {
    arr = arr.concat(videosPop);
  } else if (estilo == "rock") {
    arr = arr.concat(videosRock);
  } else {
    arr = arr.concat(videosElectro);
  }
  let numRandom = Math.floor(Math.random() * arr.length);
  console.log(arr);
  randomVideo(arr, numRandom);
}

function randomVideo(arr, num) {
  document.querySelector(".video").innerHTML = `<iframe
  width="100%"
  height="315"
  
  src= https://www.youtube.com/embed/${arr[num]}
  frameborder="0"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>`;
}
