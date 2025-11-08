import http from "http";
import fs from "fs";
import path from "path";

const PORT = 4000;

const server = http.createServer((req, res) => {
  // Ruta del archivo HTML
  const filePath = path.join(__dirname, "public", "index.html");

  // Leer el HTML
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      res.end("Error al cargar el archivo HTML");
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
