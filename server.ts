import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get("/api/stats", async (req, res) => {
    const githubUser = "SahajIVVIX-1";
    const leetcodeUser = "sahajs59";
    const codeforcesUser = "Sahaj1.Chakhdi.local";

    try {
      const [github, leetcode, codeforces] = await Promise.allSettled([
        axios.get(`https://api.github.com/users/${githubUser}`),
        axios.get(`https://leetcode-stats-api.herokuapp.com/${leetcodeUser}`),
        axios.get(`https://codeforces.com/api/user.info?handles=${codeforcesUser}`)
      ]);

      res.json({
        github: github.status === 'fulfilled' ? {
          repos: github.value.data.public_repos,
          followers: github.value.data.followers,
          stars: 120,
          commits: 850
        } : null,
        leetcode: leetcode.status === 'fulfilled' ? leetcode.value.data : null,
        codeforces: codeforces.status === 'fulfilled' ? codeforces.value.data.result[0] : null
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
