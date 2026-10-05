const formulario = document.getElementById('formulario');
const nombreInput = document.getElementById('nombre');
const colorInput = document.getElementById('color');
const idiomaSelect = document.getElementById('idioma');
const mensaje = document.getElementById('mensaje');
const borrarBtn = document.getElementById('borrar');
const contadorVisitas = document.getElementById('contadorVisitas');

const textos = {
  es: {
    titulo: 'CookieLab',
    intro: 'Guarda tu nombre y color favorito en cookies.',
    labelNombre: 'Nombre:',
    labelColor: 'Color de fondo:',
    labelIdioma: 'Idioma:',
    placeholder: 'Escribe tu nombre',
    guardar: 'Guardar',
    borrar: 'Borrar cookies',
    sinDatos: 'Aún no has guardado tus datos.',
    bienvenida: 'Bienvenido otra vez, ',
    errorNombre: 'Debes escribir un nombre.',
    guardado: '¡Listo! ',
    guardadoFin: ', tu color favorito se ha guardado.',
    borradas: 'Las cookies han sido borradas.',
    visitas: 'Visitas:',
    idioma: 'Idioma'
  },
  en: {
    titulo: 'CookieLab',
    intro: 'Save your name and favorite color in cookies.',
    labelNombre: 'Name:',
    labelColor: 'Background color:',
    labelIdioma: 'Language:',
    placeholder: 'Write your name',
    guardar: 'Save',
    borrar: 'Delete cookies',
    sinDatos: 'You have not saved your data yet.',
    bienvenida: 'Welcome back, ',
    errorNombre: 'You must write a name.',
    guardado: 'Done! ',
    guardadoFin: ', your favorite color has been saved.',
    borradas: 'Cookies have been deleted.',
    visitas: 'Visits:',
    idioma: 'Language'
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
  document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

function aplicarIdioma(idioma) {
  const t = textos[idioma] || textos.es;

  document.documentElement.lang = idioma;
  document.getElementById('titulo').textContent = t.titulo;
  document.getElementById('intro').textContent = t.intro;
  document.getElementById('labelNombre').textContent = t.labelNombre;
  document.getElementById('labelColor').textContent = t.labelColor;
  document.getElementById('labelIdioma').textContent = t.labelIdioma;
  document.getElementById('guardarBtn').textContent = t.guardar;
  document.getElementById('borrar').textContent = t.borrar;
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
  const colorGuardado = getCookie('colorFondo');
  const idiomaGuardado = getCookie('idioma') || 'es';

  idiomaSelect.value = idiomaGuardado;
  aplicarIdioma(idiomaGuardado);

  if (nombreGuardado) {
    nombreInput.value = nombreGuardado;
  }

  if (colorGuardado) {
    colorInput.value = colorGuardado;
    document.body.style.backgroundColor = colorGuardado;
  }

  const visitas = Number(getCookie('visitas') || 0) + 1;
  setCookie('visitas', String(visitas), 365);
  contadorVisitas.textContent = `${textos[idiomaGuardado].visitas} ${visitas}`;
}

formulario.addEventListener('submit', (event) => {
  event.preventDefault();

  const nombre = nombreInput.value.trim();
  const color = colorInput.value;
  const idioma = idiomaSelect.value;

  if (nombre === '') {
    mensaje.textContent = textos[idioma].errorNombre;
    return;
  }

  setCookie('nombreUsuario', nombre, 30);
  setCookie('colorFondo', color, 30);
  setCookie('idioma', idioma, 30);

  document.body.style.backgroundColor = color;
  aplicarIdioma(idioma);
  mensaje.textContent = `${textos[idioma].guardado}${nombre}${textos[idioma].guardadoFin}`;
});

idiomaSelect.addEventListener('change', (event) => {
  const idioma = event.target.value;
  setCookie('idioma', idioma, 30);
  aplicarIdioma(idioma);
});

borrarBtn.addEventListener('click', () => {
  deleteCookie('nombreUsuario');
  deleteCookie('colorFondo');
  deleteCookie('idioma');

  nombreInput.value = '';
  colorInput.value = '#f4d35e';
  document.body.style.backgroundColor = '#f4f7fb';
  idiomaSelect.value = 'es';
  aplicarIdioma('es');
  mensaje.textContent = textos.es.borradas;
});

cargarPreferencias();
