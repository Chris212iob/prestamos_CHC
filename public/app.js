/* ============================================================
   app.js · Préstamos del laboratorio
   Actividad 7 · Primer comportamiento con JavaScript
   ============================================================ */

// ===== SECCIÓN 1 · REFERENCIAS A LA PÁGINA =====
// querySelector busca UN elemento usando un selector CSS (# = id).
const formulario = document.querySelector('#prestamo');
const mensaje = document.querySelector('#mensaje');
const lista = document.querySelector('#registros');
const total = document.querySelector('#total');

// Comprobación: si ves este texto en la Consola, app.js sí se cargó.
console.log('app.js cargado', formulario);

// ===== SECCIÓN 2 · DATOS EN MEMORIA (Paso 6) =====
// Arreglo vacío. Cada préstamo será un objeto con id, material, alumno y estado.
const prestamos = [];

// ===== SECCIÓN 3 · FUNCIONES (Pasos 5 y 7) =====
// Validación (RF02): recibe un texto YA recortado y responde true o false.
function textoValido(texto) {
  return texto.length >= 2 && texto.length <= 60;
}

// Mensajes: escribe en <p id="mensaje"> con la clase ok (verde) o error (rojo).
function avisar(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = tipo;
}

// Renderizado: dibuja en la página lo que hay en el arreglo.
function mostrarPrestamos() {
  lista.replaceChildren();                // borra las filas anteriores

  for (const prestamo of prestamos) {     // recorre el arreglo
    const fila = document.createElement('li');
    const info = document.createElement('span');
    const estado = document.createElement('span');

    info.textContent = `${prestamo.id}. ${prestamo.material} · ${prestamo.alumno}`;
    estado.textContent = prestamo.estado;
    estado.className = 'estado';

    fila.append(info, estado);            // los span van dentro del li
    lista.append(fila);                   // el li va dentro del ul
  }

  total.textContent = `Total de préstamos: ${prestamos.length}`;
}

// ===== SECCIÓN 4 · EVENTO SUBMIT (Pasos 3 a 8) =====
// Se ejecuta al pulsar «Guardar préstamo» o al presionar Enter en un campo.
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();                // NO recargar la página

  // --- 4.1 LEER los campos (Paso 4) ---
  const datos = new FormData(formulario);
  const material = String(datos.get('material')).trim();
  const alumno = String(datos.get('alumno')).trim();

  // --- 4.2 VALIDAR (Paso 5) ---
  if (!textoValido(material) || !textoValido(alumno)) {
    avisar('Escribe material y alumno con 2 a 60 caracteres, sin contar los espacios.', 'error');
    return;                               // DETIENE la función: no se guarda nada
  }

  // --- 4.3 GUARDAR en el arreglo (Paso 6) ---
  prestamos.push({
    id: prestamos.length + 1,
    material: material,
    alumno: alumno,
    estado: 'pendiente'                   // todo préstamo nace pendiente
  });

  // --- 4.4 MOSTRAR la lista (Paso 7) ---
  mostrarPrestamos();

  // --- 4.5 LIMPIAR y avisar (Paso 8) ---
  formulario.reset();                     // limpia los campos
  formulario.elements.material.focus();   // el cursor regresa a Material
  avisar(`Préstamo guardado: ${material} para ${alumno}.`, 'ok');
});

// ===== SECCIÓN 5 · INICIO (Paso 7) =====
// Al abrir la página se dibuja la lista una vez (Total de préstamos: 0).
mostrarPrestamos();
