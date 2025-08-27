import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from "swagger-ui-dist";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENAPI_PATH = path.resolve(process.cwd(), "src/docs/openapi.yaml");

const html = (specUrl: string) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css"/>
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
<script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>
<script>
window.ui = SwaggerUIBundle({
  url: "/docs/openapi", 
  dom_id: '#swagger-ui',
  presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
  layout: "BaseLayout"
});
</script>
</body>
</html>`;

export const serveDocs = async () => {
  return {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: html("/docs/openapi"),
  };
};

export const serveOpenApi = async () => {
  const text = await fs.readFile(OPENAPI_PATH, "utf-8");
  return {
    statusCode: 200,
    headers: { "content-type": "application/yaml" },
    body: text,
  };
};
