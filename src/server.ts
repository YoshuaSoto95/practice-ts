import http, { IncomingMessage, ServerResponse } from "node:http";
import { marines as store, Marine } from "./data/marines";
import { parse } from "node:url";

let marines = [...store]; // estado en memoria para esta sesión

function json(res: ServerResponse, code: number, data: unknown) {
  const body = JSON.stringify(data);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function notFound(res: ServerResponse) {
  json(res, 404, { error: "Not Found" });
}

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

const server = http.createServer(async (req, res) => {
  const method = req.method || "GET";
  const url = req.url || "/";
  const { pathname, query } = parse(url, true);

  // Rutas
  if (method === "GET" && pathname === "/") {
    return json(res, 200, {
      ok: true,
      message: "Warhammer 40K API (Node + TS)",
    });
  }

  if (method === "GET" && pathname === "/marines") {
    // opcional: filtro por chapter ?chapter=Ultramarines
    const chapter =
      typeof query.chapter === "string" ? query.chapter : undefined;
    const data = chapter
      ? marines.filter((m) => m.chapter === chapter)
      : marines;
    return json(res, 200, data);
  }

  // GET /marines/:id
  const idMatch = pathname?.match(/^\/marines\/(\d+)$/);
  if (method === "GET" && idMatch) {
    const id = Number(idMatch[1]);
    const marine = marines.find((m) => m.id === id);
    return marine ? json(res, 200, marine) : notFound(res);
  }

  // POST /marines
  if (method === "POST" && pathname === "/marines") {
    try {
      const body = await getBody<Partial<Marine>>(req);
      const { name, rank, chapter } = body;

      if (!name || !rank || !chapter) {
        return json(res, 400, { error: "name, rank y chapter son requeridos" });
      }

      const newMarine: Marine = {
        id: marines.length ? Math.max(...marines.map((m) => m.id)) + 1 : 1,
        name,
        // @ts-expect-error: confiamos en validación simple del cliente para el demo
        rank,
        // @ts-expect-error
        chapter,
      };

      marines.push(newMarine);
      return json(res, 201, newMarine);
    } catch (e: any) {
      return json(res, 400, { error: e.message || "Invalid body" });
    }
  }

  // Si no coincide ninguna ruta:
  return notFound(res);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
server.listen(PORT, () => {
  console.log(`⚔️  Warhammer API running on http://localhost:${PORT}`);
});
