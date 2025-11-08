import http from "http";
import fs from "fs";
import path from "path";
import { parse } from "url";
import { soldiers } from "./module/soldiers";

const PORT = 4000;
const PUBLIC_DIR = path.join(__dirname, "public");

function sendFile(res: http.ServerResponse, filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType =
    ext === ".html"
      ? "text/html; charset=utf-8"
      : ext === ".css"
      ? "text/css; charset=utf-8"
      : ext === ".js"
      ? "text/javascript; charset=utf-8"
      : ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
      ? "image/jpeg"
      : "text/plain; charset=utf-8";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("404 Not Found");
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const { pathname } = parse(req.url || "/", true);

  // API JSON
  if (pathname === "/api/soldiers") {
    const body = JSON.stringify(soldiers);
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(body);
  }

  // Rutas estáticas (/, /about, /styles.css, /main.js, etc.)
  if (pathname === "/") {
    return sendFile(res, path.join(PUBLIC_DIR, "index.html"));
  }
  if (pathname === "/about") {
    return sendFile(res, path.join(PUBLIC_DIR, "about.html"));
  }

  // Cualquier otro archivo dentro de /public
  const filePath = path.join(PUBLIC_DIR, pathname || "");
  return sendFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`🚀 Server at http://localhost:${PORT}`);
});
