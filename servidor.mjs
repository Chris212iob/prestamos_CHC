/* ============================================================
   servidor.mjs · Préstamos del laboratorio
   Actividad 8 · Servidor web local con Node.js
   Entrega al navegador los archivos de la carpeta public.
   ============================================================ */

// ===== SECCIÓN 1 · MÓDULOS DE NODE =====
// import trae herramientas que ya vienen incluidas en Node.js (no se instalan).
import http from 'node:http';                     // crea el servidor web
import { readFile } from 'node:fs/promises';      // lee archivos del disco
import path from 'node:path';                     // arma rutas de carpetas

// ===== SECCIÓN 2 · CONFIGURACIÓN =====
// Puerto: la "puerta" por la que el navegador entra al servidor.
const PUERTO = 3000;

// Carpeta pública: SOLO lo que está aquí se entrega al navegador.
// import.meta.dirname = carpeta donde está este archivo (prestamos).
const CARPETA_PUBLICA = path.join(import.meta.dirname, 'public');

// Tipos de contenido: le dicen al navegador qué clase de archivo recibe.
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Página que se envía cuando el archivo pedido no existe (Paso 7).
const PAGINA_404 = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404 · No encontrado</title>
  <link rel="stylesheet" href="/estilos.css">
</head>
<body>
  <main>
    <section>
      <h1>404 · Página no encontrada</h1>
      <p>Ese archivo no existe en la carpeta public del servidor.</p>
      <a href="/">Volver a la aplicación</a>
    </section>
  </main>
</body>
</html>`;

// Comprobación: si ves la carpeta en la terminal, la configuración está bien.
console.log('Carpeta pública:', CARPETA_PUBLICA);

// ===== SECCIÓN 3 · FUNCIONES =====
// Envía la respuesta: código de estado, tipo de contenido y el contenido.
function responder(respuesta, codigo, tipo, contenido) {
  respuesta.writeHead(codigo, { 'Content-Type': tipo });
  respuesta.end(contenido);
}

// Bitácora: escribe en la terminal cada petición atendida.
function registrar(codigo, metodo, ruta) {
  const hora = new Date().toLocaleTimeString('es-MX');
  console.log(`[${hora}] ${codigo} ${metodo} ${ruta}`);
}

// ===== SECCIÓN 4 · ATENDER CADA PETICIÓN =====
// Esta función se ejecuta CADA VEZ que el navegador pide algo.
const servidor = http.createServer(async (peticion, respuesta) => {
  try {
    // --- 4.1 LEER la ruta que pidió el navegador ---
    const direccion = new URL(peticion.url, `http://localhost:${PUERTO}`);
    let ruta = decodeURIComponent(direccion.pathname);
    if (ruta === '/') {
      ruta = '/index.html';                     // la raíz abre la página principal
    }

    // --- 4.2 UBICAR el archivo dentro de public ---
    const archivo = path.join(CARPETA_PUBLICA, ruta);

    // Seguridad (Paso 8): si la ruta intenta salir de public, se rechaza (403).
    if (!archivo.startsWith(CARPETA_PUBLICA + path.sep)) {
      responder(respuesta, 403, 'text/plain; charset=utf-8', '403 · Acceso prohibido');
      registrar(403, peticion.method, ruta);
      return;
    }

    // --- 4.3 LEER el archivo y ENVIARLO (200) ---
    const contenido = await readFile(archivo);
    const tipo = TIPOS[path.extname(archivo)] ?? 'application/octet-stream';
    responder(respuesta, 200, tipo, contenido);
    registrar(200, peticion.method, ruta);

  } catch {
    // --- 4.4 NO EXISTE: responder 404 (Paso 7) ---
    responder(respuesta, 404, 'text/html; charset=utf-8', PAGINA_404);
    registrar(404, peticion.method, peticion.url);
  }
});

// ===== SECCIÓN 5 · INICIO =====
// listen deja al servidor esperando peticiones en el puerto indicado.
servidor.listen(PUERTO, () => {
  console.log(`Servidor listo en http://localhost:${PUERTO}`);
  console.log('Para detenerlo presiona Ctrl + C');
});
