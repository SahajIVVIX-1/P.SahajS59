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

  app.use(express.json());

  // Chatbot API route
  const RESUME_CONTEXT = `
Name: Sahaj Saliya
Education: B.Tech ICT at PDEU Gandhinagar (2023–2027), GPA: 8.5/10.0
Contact: Email: sahajs59@gmail.com | LinkedIn: https://in.linkedin.com/in/sahajs59 | GitHub: https://github.com/SahajIVVIX-1 | Medium: https://sahajs59.medium.com/

Skills:
  Languages: Python (Advanced), C/C++, MATLAB, SQL, Java, JavaScript
  Frameworks: Node.js, React, Flask, MySQL, MongoDB, Docker
  ML/AI: Scikit-Learn, PyTorch, YOLOv11, OpenCV, Deep Learning, Computer Vision
  Systems: Networking, Windows/Linux Administration, Firewalls, Cybersecurity
  Tools: Power BI, Excel VBA, Notion, Prompt Engineering

Projects:
  1. Chakhdi-Sentry AI – Autonomous security guardian that hunts vulnerabilities using ML to detect and neutralize threats. Tech: Python 3, Scikit-Learn, BeautifulSoup4, Pandas.
  2. SentinelProxy Suite – AI-driven Windows Node.js gateway with transparent HTTPS proxying and DNS resolution. Tech: Node.js, Socket.IO, SQLite, DNS, PowerShell.
  3. Microplastic Detection System – YOLOv11 object detection model for microplastic particles from visual data. Tech: Python, YOLOv11, PyTorch, OpenCV, CUDA.
  4. Python Productivity Tools – Suite including Smaran (Smart Reminder), PyEnv Launcher, Digital Hand Cricket. Tech: Python, PyQt6, Git, Windows Registry.

Research Publications:
  1. "Deepfake Audio Detection using Deep Learning" – IEEE AIMV 2025, DOI: 10.1109/AIMV66517.2025.11203307
  2. "Intelligent Cognitive Frameworks for Crime Prediction in Smart Cities" – IEEE AIMV 2025, DOI: 10.1109/AIMV66517.2025.11203581

Timeline:
  2025: Presented two papers at 2nd IEEE Conference on AIMV (Artificial Intelligence, Machine Vision).
  2025: Fine-tuned Gemini 1.5 Pro at GDG Gandhinagar (Vertex AI & Firebase Workshop).
  2024: Participated in Code4Cause Hackathon (national level, Delhi).
  2023: Started B.Tech ICT at PDEU Gandhinagar.

Certifications:
  - Deep Learning – NPTEL IIT Ropar (66%)
  - AI/ML for Geodata Analysis – IISRO-IIRS (ISRO)
  - Code4Cause Hackathon 2.0 (National-level)
  - Signal Processing Onramp – Applied MATLAB

Scientific Interests: Machine Learning, Deep Learning, Computer Vision, Systems Security, Autonomous Defense Systems.
  `;

  app.post("/api/chat", async (req, res) => {
    const { message } = req.body as { message?: string };
    if (!message) return res.status(400).json({ error: "Message required" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(503).json({ error: "AI service not configured. Please set GEMINI_API_KEY." });

    // Sanitize user input: strip null bytes, limit length
    const sanitized = message.replace(/\0/g, "").slice(0, 500);

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `You are an AI assistant embedded in Sahaj Saliya's portfolio website. Answer the user's question using ONLY the information below. If the answer is not found, say "I don't have that information about Sahaj."\n\nResume context:\n${RESUME_CONTEXT}\n\nUser question: ${sanitized}`,
      });
      res.json({ response: result.text });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

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
