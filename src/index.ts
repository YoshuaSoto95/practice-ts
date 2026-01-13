import http, { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { parse } from "node:url";
// Importamos los datos y la interfaz desde nuestro archivo de datos
import { marines as store, Marine } from "./data/marines";

/**
 * Estado en memoria para esta sesión del servidor.
 * En una aplicación real, esto vendría de una base de datos.
 */
let marines = [...store];

/**
 * Función auxiliar para enviar respuestas JSON.
 * @param res Objeto de respuesta del servidor
 * @param code Código de estado HTTP (200, 404, etc.)
 * @param data Datos a enviar como JSON
 */
function json(res: ServerResponse, code: number, data: unknown) {
  const body = JSON.stringify(data);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

/**
 * Función auxiliar para manejar rutas no encontradas (404).
 */
function notFound(res: ServerResponse) {
  json(res, 404, { error: "Not Found" });
}

/**
 * Función para servir archivos estáticos (HTML, CSS, JS).
 * @param res Objeto de respuesta
 * @param filepath Ruta relativa del archivo dentro de 'public'
 * @param contentType Tipo MIME del archivo
 */
function serveStatic(
  res: ServerResponse,
  filepath: string,
  contentType: string
) {
  const fullPath = path.join(__dirname, "public", filepath);

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        notFound(res);
      } else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
}

/**
 * Helper para leer el cuerpo de la petición (para POST/PUT).
 */
async function getBody<T = any>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf-8").trim();
      if (!raw) return resolve({} as T);
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

/**
 * Creor el servidor HTTP.
 * Aquí manejamos todas las peticiones entrantes.
 */
const server = http.createServer(async (req, res) => {
  const method = req.method || "GET";
  const url = req.url || "/";
  const { pathname, query } = parse(url, true);

  console.log(`[REQUEST] ${method} ${pathname}`);

  // -- API ROUTES --

  // GET /api -> Mensaje de bienvenida
  if (pathname === "/api") {
    return json(res, 200, {
      ok: true,
      message: "Warhammer 40K API (Node + TS)",
    });
  }

  // GET /api/marines -> Listar todos los marines (con filtro opcional)
  if (method === "GET" && pathname === "/api/marines") {
    const chapter =
      typeof query.chapter === "string" ? query.chapter : undefined;
    const data = chapter
      ? marines.filter((m) => m.chapter === chapter)
      : marines;
    return json(res, 200, data);
  }

  // GET /api/marines/:id -> Obtener un marine por ID
  // Usamos una expresión regular para capturar el ID de la URL
  const idMatch = pathname?.match(/^\/api\/marines\/(\d+)$/);
  if (method === "GET" && idMatch) {
    const id = Number(idMatch[1]);
    const marine = marines.find((m) => m.id === id);
    return marine ? json(res, 200, marine) : notFound(res);
  }

  // POST /api/marines -> Crear un nuevo marine
  if (method === "POST" && pathname === "/api/marines") {
    try {
      const body = await getBody<Partial<Marine>>(req);
      const { name, rank, chapter } = body;

      if (!name || !rank || !chapter) {
        return json(res, 400, { error: "name, rank y chapter son requeridos" });
      }

      const newMarine: Marine = {
        // Generamos un ID simple incrementando el máximo actual
        id: marines.length ? Math.max(...marines.map((m) => m.id)) + 1 : 1,
        name,
        rank,
        chapter,
        status: true,
      };

      marines.push(newMarine);
      return json(res, 201, newMarine);
    } catch (e: any) {
      return json(res, 400, { error: e.message || "Invalid body" });
    }
  }

  // -- STATIC FILES ROUTES --

  // GET / -> Servir index.html
  if (method === "GET" && (pathname === "/" || pathname === "/index.html")) {
    return serveStatic(res, "index.html", "text/html");
  }

  // GET /styles.css
  if (method === "GET" && pathname === "/styles.css") {
    return serveStatic(res, "styles.css", "text/css");
  }

  // GET /main.js
  if (method === "GET" && pathname === "/main.js") {
    return serveStatic(res, "main.js", "application/javascript");
  }

  // GET /about
  if (
    method === "GET" &&
    (pathname === "/about" || pathname === "/about.html")
  ) {
    return serveStatic(res, "about.html", "text/html");
  }

  // Si no coincide ninguna ruta
  return notFound(res);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
server.listen(PORT, () => {
  console.log(`⚔️  Warhammer API & App running on http://localhost:${PORT}`);
});
