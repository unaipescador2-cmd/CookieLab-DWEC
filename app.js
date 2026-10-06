const formulario = document.getElementById('formulario');
const nombreInput = document.getElementById('nombre');
const idiomaSelect = document.getElementById('idioma');
const temaBtn = document.getElementById('temaBtn');
const mensaje = document.getElementById('mensaje');
const cambiarNombreBtn = document.getElementById('cambiarNombreBtn');
const olvidarmeBtn = document.getElementById('olvidarmeBtn');
const contadorVisitas = document.getElementById('contadorVisitas');

const textos = {
  es: {
    titulo: 'CookieLab',
    intro: 'Guarda tu nombre y tus preferencias en cookies.',
    labelNombre: 'Nombre:',
    labelColor: 'Color de fondo:',
    labelIdioma: 'Idioma:',
    labelTema: 'Tema:',
    placeholder: 'Escribe tu nombre',
    guardar: 'Guardar',
    cambiarNombre: 'Cambiar mi nombre',
    olvidarme: 'Olvidarme',
    sinDatos: 'Aún no has guardado tus datos.',
    bienvenida: 'Bienvenido otra vez, ',
    errorNombre: 'Debes escribir un nombre.',
    guardado: '¡Listo! ',
    guardadoFin: ' se ha guardado correctamente.',
    borradas: 'Las cookies han sido borradas.',
    visitas: 'Visitas:',
    temaClaro: 'Claro',
    temaOscuro: 'Oscuro'
  },
  en: {
    titulo: 'CookieLab',
    intro: 'Save your name and your preferences in cookies.',
    labelNombre: 'Name:',
    labelColor: 'Background color:',
    labelIdioma: 'Language:',
    labelTema: 'Theme:',
    placeholder: 'Write your name',
    guardar: 'Save',
    cambiarNombre: 'Change my name',
    olvidarme: 'Forget me',
    sinDatos: 'You have not saved your data yet.',
    bienvenida: 'Welcome back, ',
    errorNombre: 'You must write a name.',
    guardado: 'Done! ',
    guardadoFin: ' has been saved correctly.',
    borradas: 'Cookies have been deleted.',
    visitas: 'Visits:',
    temaClaro: 'Light',
    temaOscuro: 'Dark'
  }
};

function setCookie(nombre, valor, dias = 30) {
  const fecha = new Date();
  fecha.setTime(fecha.getTime() + dias * 24 * 60 * 60 * 1000);
  document.cookie = `${nombre}=${encodeURIComponent(valor)};expires=${fecha.toUTCString()};path=/`;
}

function getCookie(nombre) {
  const cookies = document.cookie.split('; ');

  for (const cookie of cookies) {
    const [clave, valor] = cookie.split('=');
    if (clave === nombre) {
      return decodeURIComponent(valor);
    }
  }

  return null;
}

function deleteCookie(nombre) {
  document.cookie = `${nombre}=; max-age=0; path=/`;
}

function borrarTodasCookies() {
  ['nombreUsuario', 'idioma', 'tema', 'visitas'].forEach((nombre) => deleteCookie(nombre));
}

function aplicarTema(tema) {
  const body = document.body;
  const activo = tema === 'dark';

  body.classList.toggle('dark', activo);
  temaBtn.textContent = activo ? 'Oscuro' : 'Claro';

  if (activo) {
    body.style.backgroundColor = '#0f172a';
  } else {
    body.style.backgroundColor = '#f4f7fb';
  }
}

function aplicarIdioma(idioma) {
  const t = textos[idioma] || textos.es;

  document.documentElement.lang = idioma;
  document.getElementById('titulo').textContent = t.titulo;
  document.getElementById('intro').textContent = t.intro;
  document.getElementById('labelNombre').textContent = t.labelNombre;
  document.getElementById('labelIdioma').textContent = t.labelIdioma;
  document.getElementById('labelTema').textContent = t.labelTema;
  document.getElementById('guardarBtn').textContent = t.guardar;
  document.getElementById('cambiarNombreBtn').textContent = t.cambiarNombre;
  document.getElementById('olvidarmeBtn').textContent = t.olvidarme;
  nombreInput.placeholder = t.placeholder;
  contadorVisitas.textContent = `${t.visitas} ${getCookie('visitas') || 0}`;

  const nombreGuardado = getCookie('nombreUsuario');

  if (nombreGuardado) {
    mensaje.textContent = `${t.bienvenida}${nombreGuardado}!`;
  } else {
    mensaje.textContent = t.sinDatos;
  }
}

function cargarPreferencias() {
  const nombreGuardado = getCookie('nombreUsuario');
  const idiomaGuardado = getCookie('idioma') || 'es';
  const temaGuardado = getCookie('tema') || 'light';

  idiomaSelect.value = idiomaGuardado;
  aplicarIdioma(idiomaGuardado);
  aplicarTema(temaGuardado);

  if (nombreGuardado) {
    nombreInput.value = nombreGuardado;
  }

  const visitas = Number(getCookie('visitas') || 0) + 1;
  setCookie('visitas', String(visitas), 365);
  contadorVisitas.textContent = `${textos[idiomaGuardado].visitas} ${visitas}`;
}

formulario.addEventListener('submit', (event) => {
  event.preventDefault();

  const nombre = nombreInput.value.trim();
  const idioma = idiomaSelect.value;
  const tema = getCookie('tema') || 'light';

  if (nombre === '') {
    mensaje.textContent = textos[idioma].errorNombre;
    return;
  }

  setCookie('nombreUsuario', nombre, 30);
  setCookie('idioma', idioma, 30);
  setCookie('tema', tema, 30);

  aplicarTema(tema);
  aplicarIdioma(idioma);
  mensaje.textContent = `${textos[idioma].guardado}${nombre}${textos[idioma].guardadoFin}`;
});

idiomaSelect.addEventListener('change', (event) => {
  const idioma = event.target.value;
  setCookie('idioma', idioma, 30);
  aplicarIdioma(idioma);
});

temaBtn.addEventListener('click', () => {
  const nuevoTema = getCookie('tema') === 'dark' ? 'light' : 'dark';
  setCookie('tema', nuevoTema, 30);
  aplicarTema(nuevoTema);
});

cambiarNombreBtn.addEventListener('click', () => {
  const idioma = idiomaSelect.value || getCookie('idioma') || 'es';
  const nombreActual = getCookie('nombreUsuario') || '';
  const nombreNuevo = prompt('Escribe tu nuevo nombre:', nombreActual);

  if (nombreNuevo === null) {
    return;
  }

  const nombre = nombreNuevo.trim();

  if (!nombre) {
    mensaje.textContent = textos[idioma].errorNombre;
    return;
  }

  setCookie('nombreUsuario', nombre, 30);
  nombreInput.value = nombre;
  aplicarIdioma(idioma);
  mensaje.textContent = `${textos[idioma].guardado}${nombre}${textos[idioma].guardadoFin}`;
});

olvidarmeBtn.addEventListener('click', () => {
  const confirmar = confirm('¿Seguro que quieres olvidarte de todos tus datos?');

  if (!confirmar) {
    return;
  }

  borrarTodasCookies();
  nombreInput.value = '';
  idiomaSelect.value = 'es';
  aplicarTema('light');
  aplicarIdioma('es');
  contadorVisitas.textContent = `${textos.es.visitas} 0`;
  mensaje.textContent = textos.es.borradas;
});

cargarPreferencias();
