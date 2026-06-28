import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  // Dynamic port to support different environments like Google Cloud Run or Firebase App Hosting (e.g. PORT=8080)
  // while defaulting to port 3000 for local AI Studio workspace preview.
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development vs static build runner for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Robust path resolution: if bundled, __dirname points to /app/dist where assets and index.html reside
    const distPath = __dirname.endsWith("dist") ? __dirname : path.join(process.cwd(), "dist");
    
    console.log(`[Production] Static files path: ${distPath}`);
    try {
      if (fs.existsSync(distPath)) {
        console.log(`[Production] distPath exists. Contents:`, fs.readdirSync(distPath));
      } else {
        console.warn(`[Production] distPath does NOT exist!`);
      }
    } catch (e) {
      console.error("[Production] Failed to list distPath:", e);
    }

    // Serve static files with custom headers if needed
    app.use(express.static(distPath, {
      maxAge: "1d",
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        }
      }
    }));
    
    // Serve index.html for all SPA routes in production, but return 404 for missing assets/files
    app.get("*", (req, res) => {
      // Check if the requested path looks like a static asset/file
      const isAsset = req.path.includes(".") || req.path.startsWith("/assets/") || req.path.startsWith("/public/");
      if (isAsset) {
        res.status(404).send("Asset not found");
        return;
      }
      
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      
      try {
        const indexPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexPath)) {
          let html = fs.readFileSync(indexPath, "utf8");
          
          // Determine protocol and host to generate absolute URLs for crawlers (like WhatsApp)
          const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
          const host = req.get("host");
          const baseUrl = `${protocol}://${host}`;
          
          // Dynamically replace relative image path with absolute URL
          html = html.replace(/content="\/happy_face\.jpg"/g, `content="${baseUrl}/happy_face.jpg"`);
          
          res.send(html);
          return;
        }
      } catch (err) {
        console.error("Error dynamically injecting absolute OG image:", err);
      }
      
      // Fallback
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
