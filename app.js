//DECLARACION DE VARIABLES
//LAS 3 SOLAPAS
let pomodoroTimer = document.querySelector(".pomodoroTimer");
let descansoCorto = document.querySelector(".descansoCorto");
let descansoLargo = document.querySelector(".descansoLargo");
//EL TIMER
let tiempo = document.querySelector(".tiempo");
//EL INTERRUPTOR
let start = document.querySelector(".button-wrap");
//LA CONFIGURACION Y SUS OPCIONES, RANGO, SPANS, BOTONES, ETC
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
//MODAL DE AGREGAR TAREA
let agregarTarea = document.querySelector(".agregarTarea");
let cancelarTarea = document.querySelector(".cancelarTarea");
let descripcionTarea = document.querySelector("#descripcionTarea");
let numPomodoros = document.querySelector("#numPomodoros");
//LISTA DE TAREAS
let listGroup = document.querySelector(".list-group");
let listaTareasDinamica = document.querySelector(".listaDinamica");
let cerrarConfig = document.querySelector(".cerrarConfig");
let acumulados = document.querySelector(".acumulados");
//DIVS CON TAREAS Y VIDEOS QUE SE ESCONDEN
let esconder = document.querySelector(".esconder");
let videoShow = document.querySelector(".videoShow");
let verVideo = document.querySelector(".verVideo");
let video = document.querySelector(".video");
//BARRA DE PROGRESO
let progressBar = document.querySelector(".progress-bar");
//SONIDOS
let on = document.querySelector(".on");
let off = document.querySelector(".off");
let bongo = document.querySelector(".bongo");

//VARIABLES GLOBALES
let flagConteo = null;
let pausa = false;
let minutos, segundos;

//FUNCIONES QUE SON LLAMADAS CADA VEZ QUE SE CARGA LA PÁGINA
document.onload = relojes();
document.onload = setearReloj(localStorage.getItem("minutoPomodoro"));
document.onload = actualizarListaTareas();
document.onload = setMusica();

/* EVENT LISTENERS */

//DECIDÍ DETENER EL COMPORTAMIENTO DEFAULT DEL EVENTO DE CADA BOTÓN Y COMPONENTE

agregarLink.addEventListener("click", function (event) {
  event.preventDefault();
  agregarLinkYouTube();
});

//ESTE FOR LE AGREGA UN EVENT LISTENER A CADA RADIO BUTTON DE CONFIG, IMPOSIBLE HACERLO CON UN QUERY SELECTOR ALL
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

//CADA VEZ QUE SE HACE CLICK EN LA OPCION DE CONFIGURACION, SE ACTUALIZAN LOS RANGOS CON LA MEMORIA LOCAL
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

//CADA VEZ QUE SE GUARDAN CAMBIOS EN LA CONFIGURACIÓN, SE VUELVE AL INICIO DEL POMODORO PRINCIPAL
cerrarConfig.addEventListener("click", function (event) {
  event.preventDefault();
  eventoPomodoro();
});

//PARA CUANDO SE HACE CLICK EN LA CRUZ
listaTareasDinamica.addEventListener("click", function (e) {
  borrarTarea(e);
});

agregarTarea.addEventListener("click", function (event) {
  funcAgregarTarea(event);
});
cancelarTarea.addEventListener("click", function (event) {
  funcCancelarTarea(event);
});

//CADA VEZ QUE SE CLICKEA UNA SOLAPA, SE ACTIVAN 3 FUNCIONES DISTINTAS DE ACTUALIZACION DE VALORES
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

//////////////////////////////////////////////////////////////////////////////////////////

/* FUNCIONES */

//LA NOMENCLATURA Y LOS NOMBRES DE LAS FUNCIONES SON LO BASTANTE DESCRIPTIVAS

//LA FUNCION RELOJES PRIMERO CHEQUEA SI ESTAN GUARDADAS LAS OPCIONES EN MEMORIA LOCAL, Y DE NO ESTAR, LAS SETEA POR PRIMERA VEZ CON LOS VALORES ESTANDAR. SI ESTAS SE CAMBIAN LUEGO, ESTA FUNCION LAS RESPETA Y NO LAS MODIFICA.
function relojes() {
  if (localStorage.getItem("minutoPomodoro") == null)
    localStorage.setItem("minutoPomodoro", 25);
  if (localStorage.getItem("minutoDescansoCorto") == null)
    localStorage.setItem("minutoDescansoCorto", 5);
  if (localStorage.getItem("minutoDescansoLargo") == null)
    localStorage.setItem("minutoDescansoLargo", 20);
  if (localStorage.getItem("conteoPomodoros") == null)
    localStorage.setItem("conteoPomodoros", 0);
  //SE SETEA EN TRUE EL POMODORO ACTIVO (EL QUE SE CUENTA), LO MISMO CON LOS MINUTOS DE LA BARRA Y SE ACTUALIZA EL CONTEO DE POMODOROS
  localStorage.setItem("pomodoroActivo", true);
  localStorage.setItem("minutosBarra", localStorage.getItem("minutoPomodoro"));
  actualizarConteoPomodoros();
}

function actualizarConteoPomodoros() {
  let cant = localStorage.getItem("conteoPomodoros");
  acumulados.innerHTML = cant;
}

//LOS CODIGOS DE VIDEOS DE YOUTUBE SON, POR AHORA, SI O SI 11 CARACTERES, ENTONCES HAGO UNA VALIDACION PARA EVITAR OTRO TIPO DE LENGTH DE STRING
function agregarLinkYouTube() {
  if (linkYouTube.value.length == 11) {
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
}

//SETEAR EL TIPO DE MUSICA, POR DEFECTO, SE GUARDA EN MEMORIA LOCAL LA OPCION DE 'SHUFFLE'
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

//CADA UNO DE LAS SIGUIENTES 3 FUNCIONES HACE LO MISMO, PERO PARA CADA SOLAPA DE OPCION. CAMBIAR EL COLOR DE FONDO, CON LA RESPECTIVA TRANSICION DE CSS, LUEGO SETEA EL RELOJ CON LOS MINUTOS CORRESPONDIENTES, SETEA EL 100% DE LA BARRA, DETIENE EL RELOJ, MUESTRA O ESCONDE LAS TAREAS O LOS VIDEOS, Y PONE O BORRA EL SUBRAYADO DE CADA SOLAPA.
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
  document.querySelector(".primeraPagina").style.backgroundColor = color1;
  document.querySelector(".mainClock").style.backgroundColor = color2;
  document.querySelector(".barra").style.backgroundColor = color2;
}

//ESTA FUNCION SERÁ LA QUE GUARDA EN MEMORIA CUÁL DE LOS RELOJES ESTÁ ACTIVO, Y DESDE ESTOS NUMEROS SE HACE EL CONTEO REGRESIVO. PARA EFECTIVAMENTE MOSTRAR EL MINUTO Y SEGUNDO DESCONTADO, PRIMERO SE PONE UN MINUTO MENOS DEL REAL, Y EL SEGUNDO EN 60. ENTONCES, SI ES 25:00, LO PRIMERO SERÁ 24:59 Y ASÍ.
function setearReloj(mins) {
  localStorage.setItem("segundo", 60);
  localStorage.setItem("minuto", mins - 1);
  tiempo.innerHTML = `<span>${mins}:00</span>`;
  actualizarListaTareas();
}

//EN PC SE RESPETA LO DEFINIDO EN HTML PARA LA CANTIDAD DE CARACTERES Y VALORES. EN MOBILE NO, POR LO QUE HAY QUE VALIDAR DE OTRA MANERA. SI EN CELULAR PONEN 33214, SE TRANSFORMA A 9, LO MISMO CON VALORES NEGATIVOS Y 1. UNICA VEZ QUE USO JQUERY PARA ESCONDER EL MODAL, SACADO DE BOOTSTRAP
function funcAgregarTarea(e) {
  e.preventDefault();
  if (numPomodoros.value > 9) numPomodoros.value = 9;
  if (numPomodoros.value < 0) numPomodoros.value = 1;
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

//LA HORA APROXIMADA DEL FIN DE TAREA, PRESENTA VARIOS PROBLEMAS. SIENDO LA PRIMERA TAREA, NO HAY QUE CONTAR LOS MINUTOS DE DESCANSO SI EL POMODORO ES 1 SOLO. ES DECIR, SI SE ESTABLECE UNA TAREA A LAS 15 HORAS QUE DEMANDA UN SOLO POMODORO, ESTA TERMINA 15:25. A PARTIR DEL SEGUNDO POMODORO, SI HAY QUE CONTAR LOS DESCANSOS, SIENDO EL 5 Y EL 9, SUMADOS LOS DESCANSOS LARGOS.
function calcularTiempoPrimeraTarea(tarea) {
  //EN EL MOMENTO DE HACER ESTA FUNCION, NO ME DEJÓ AGREGAR CAMPOS DIRECTAMENTE AL OBJETO CREADO, TUVE QUE CREARLOS CON VALORES EN 0 Y DESPUES USARLOS.
  let objeto = {
    horas: "",
    minutos: "",
    mins: "",
    cantPomodoros: "",
  };
  //LA PRIMERA TAREA USARÁ TIEMPO REAL PARA CALCULAR LA HORA DE FIN, LAS DEMAS, SERÁN A PARTIR DE ESTA PRIMERA.
  let time = new Date();
  objeto.horas = time.getHours();
  objeto.minutos = time.getMinutes();
  objeto.mins = 0;
  objeto.cantPomodoros = tarea.cantPom;
  //POR CANTIDAD DE POMODOROS ESTABLECIDOS, CALCULO CUANTO TIEMPO LLEVARÁ Y LA HORA DE FIN APROXIMADA
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
  //SEGUN EL TOTAL DE MINUTOS DE POMODOROS, CALCULO LA HORA
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

//LAS DEMAS HORAS APROXIMADAS, SE CALCULAN DE ACUERDO A LA HORA DE LA PRIMERA TAREA, PERO NO SIEMPRE SERÁ EXACTO DE ACUERDO A LOS DESCANSOS. ES UNA HORA APROXIMADA
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

//LA LISTA DE TAREAS SE MUESTRA SOLO SI HAY TAREAS EN MEMORIA LOCAL, SINO SE ESCONDE LA CABECERA.
function actualizarListaTareas() {
  if (
    localStorage.getItem("tareas") != null &&
    localStorage.getItem("tareas") != "[]"
  ) {
    //CREO LA CABECERA
    listaTareasDinamica.innerHTML = `
      <a class="list-group-item list-group-item-action">
      <div class="row m-0">
      <div class="col-6">Descripción</div>
      <div class="col-3">Poms</div>
      <div class="col-3">Finaliza</div>
      </div>
      </a>        
    `;
    let nuevaLista = [];
    //LEO LA LISTA DE TAREAS (CON O SIN LA HORA ESTABLECIDA) Y CALCULO EL TIEMPO APROX DE FIN DE TAREA CADA VEZ QUE SE ACTUALIZA
    let lista = JSON.parse(localStorage.getItem("tareas"));
    for (let index = 0; index < lista.length; index++) {
      if (index == 0) nuevaLista.push(calcularTiempoPrimeraTarea(lista[index]));
      else
        nuevaLista.push(
          calcularTiempoTarea(lista[index], nuevaLista[index - 1])
        );
    }
    //GUARDO LA LISTA DE TAREAS EN MEMORIA LOCAL, CON LAS HORAS ACTUALIZADAS
    localStorage.setItem("tareas", JSON.stringify(nuevaLista));
    lista = JSON.parse(localStorage.getItem("tareas"));
    //SEGUN CADA TAREA SEA PAR O IMPAR, LE PONGO UN COLOR DISTINTO A CADA ITEM
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

//FUNCION DE GUARDAR TAREAS EN MOMERIA LOCAL, DONDE SE PONE CADA NUMERO DE ID SIN PISAR AL OTRO, Y DONDE SE DEFINE UN MAXIMO DE 6 TAREAS POSIBLES
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

//LA FUNCION MAS PRINCIPAL DE TODAS, DONDE SE HACE EL CONTEO REGRESIVO. ES UNA FUNCION CON SETINTERVAL, QUE NO DEJA DE FUNCIONAR SI EL TIEMPO SE PAUSA, POR LO QUE USO UN FLAG DE PAUSA, PERO SI DEJA DE FUNCIONAR SI SE CAMBIAN LOS VALORES O SE CAMBIA DE SOLAPA.
//ESTA FUNCION SE LLAMA CADA VEZ QUE SE CLICKEA EL INTERRUPTOR
function cuentaRegresiva(e) {
  e.preventDefault();
  //SEGUN SE TOCA EL INTERRUPTOR, EL FLAG DE PAUSA CAMBIA
  pausa = !pausa;
  //REPRODUCCION DE SONIDO
  if (pausa) {
    on.currentTime = 0; //REBOBINA EL AUDIO A 0, BUENA PRÁCTICA APRENDIDA DE WES BOS
    on.play();
  } else {
    off.currentTime = 0;
    off.play();
  }
  //IF(!FLAGCONTEO) COMPRUEBA SI EL INTERVALO ESTÁ INACTIVO, Y LO ACTIVA COMO PRIMERA ACCION
  if (!flagConteo) {
    flagConteo = setInterval(() => {
      if (pausa) {
        //SIEMPRE USO ESTAS VARIABLES SETEADAS EN MEMORIA LOCAL, SON LAS PRINCIPALES
        segundos = localStorage.getItem("segundo");
        minutos = localStorage.getItem("minuto");
        //MIENTRAS LOS SEGUNDOS SEAN MAYOR A 0, SOLO VOY DESCONTANDO LOS SEGUNDOS Y LISTO
        if (segundos > 0) {
          segundos--;
          localStorage.setItem("segundo", segundos);
        } else {
          //LA COSA CAMBIA SI LOS SEGUNDOS LLEGAN A 0
          //EN CASO DE QUE EL MINUTO TAMBIEN, SE ACTIVA EL EVENTO DE FIN DE POMODORO
          if ((minutos == 0) & (segundos == 0)) {
            //SONIDO DE FIN DE POMODORO
            bongo.currentTime = 0;
            bongo.play();
            //PUEDO ESTAR EN UN POMODORO DE TAREA O EN UN DESCANSO. EN EL PRIMER CASO, SUMO UN POMODORO ACUMULADO
            if (JSON.parse(localStorage.getItem("pomodoroActivo"))) {
              sumarPomodoro();
              //CHEQUEO EL CONTEO DE POMODOROS. SI VOY POR EL 4, 8, 12, ETC, DESCANSO LARGO, Y SI NO, DESCANSO CORTO
              if (JSON.parse(localStorage.getItem("conteoPomodoros")) % 4 != 0)
                eventoDescansoCorto();
              else eventoDescansoLargo();
            } else {
              eventoPomodoro();
            }
            //PARA CUALQUIER CASO DE FIN DE CONTEO, EL INTERVALO DEL CONTEO REGRESIVO SE DETIENE
            clearInterval(flagConteo);
            return;
          } else {
            //ESTO EN CASO DE QUE SEGUNDO LLEGUE A 0 PERO LOS MINUTOS NO
            minutos--;
            segundos = 59;
            localStorage.setItem("segundo", segundos);
            localStorage.setItem("minuto", minutos);
          }
        }
        //CADA SEGUNDO QUE PASA, SE MODIFICA LA BARRA DE PROGRESO
        accionBarra(minutos, segundos);
        //LO SIGUIENTE ES PARA MOSTRAR EN PANTALLA EL TIEMPO
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

//CADA VEZ QUE SE PARA EL RELOJ, SE DETIENE EL INTERVALO
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

//ACA DEPENDE SI ESTÁ MARCADA LA OPCION DE SHUFFLE O NO. SI NO LO ESTA, SOLO SELECCIONO DEL ARREGLO DE GENERO CORRESPONDIENTE, Y SI NO, CONCATENO TODOS, Y HAGO UN RANDOM ENTRE LOS 3 GENEROS Y ENTRE EL PERSONAL DEL USUARIO EN CASO DE HABERLO.
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

//CUESTIONES PARA UNA REFACTORIZACION
//CAMBIAR LA MAYORIA DE LOS 'LET' POR 'CONST'
//REVISAR SI ES NECESARIO AGREGAR UN EVENT.PREVENTDEFAULT() A TODOS LOS COMPONENTES Y BOTONES
//REVISAR QUE DEJE DE CALCULAR LA HORA APROXIMADA DE FIN PARA CADA TAREA TERMINADA
