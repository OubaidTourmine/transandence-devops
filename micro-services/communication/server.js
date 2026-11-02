const http = require("node:http");
const fs = require("node:fs");

const service = process.env.SERVICE_NAME || "communication";
const port = Number(process.env.PORT || 3000);

const sendJson = (response, statusCode, body) => {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
};

const server = http.createServer((request, response) => {
  const url = new URL(request.url, "http://localhost");

  if (request.method === "GET" && url.pathname === "/health") {
    return sendJson(response, 200, { status: "ok", service });
  }

  if (request.method === "GET" && url.pathname === `/api/${service}/status`) {
    return sendJson(response, 200, {
      service,
      status: "starter-ready",
      message: "Replace this endpoint with the first real service contract."
    });
  }

  if (request.method === "GET" && url.pathname === "/") {
    response.writeHead(200, { "Content-Type": "text/html" });
    return response.end(fs.readFileSync("index.html"));
  }

  if (request.method === "GET" && url.pathname === "/style.css") {
    response.writeHead(200, { "Content-Type": "text/css" });
    return response.end(fs.readFileSync("style.css"));
  }

  return sendJson(response, 404, { error: "not_found" });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`${service} listening on port ${port}`);
});
