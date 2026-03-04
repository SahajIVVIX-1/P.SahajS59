import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const SUGGESTED = [
  'Who is Sahaj?',
  'What projects has Sahaj built?',
  'What technologies does Sahaj use?',
  'What research has Sahaj published?',
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hi! I'm Sahaj's AI assistant. Ask me anything about his work, projects, or skills." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = useMemo(() => apiKey ? new GoogleGenAI({ apiKey }) : null, [apiKey]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    if (!ai) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'AI service is not configured.' }]);
      setLoading(false);
      return;
    }

    try {
      const sanitized = text.replace(/\0/g, '').slice(0, 500);
      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `You are an AI assistant embedded in Sahaj Saliya's portfolio website. Answer the user's question using ONLY the information below. If the answer is not found, say "I don't have that information about Sahaj."\n\nResume context:\n${RESUME_CONTEXT}\n\nUser question: ${sanitized}`,
      });
      setMessages(prev => [...prev, { role: 'assistant', text: result.text || 'Unable to process your question. Please try rephrasing.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Unable to process your question. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="w-80 sm:w-96 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            style={{
              background: 'rgba(10,10,10,0.97)',
              border: '1px solid rgba(0,229,255,0.2)',
              boxShadow: '0 0 30px rgba(0,229,255,0.1)',
              maxHeight: '520px',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10"
              style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(124,77,255,0.15))' }}
            >
              <div className="flex items-center gap-2">
                <Bot size={20} className="text-[#00E5FF]" />
                <span className="font-bold text-sm">Sahaj's AI Assistant</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0, maxHeight: 340 }}>
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    m.role === 'user' ? 'bg-[#7C4DFF]/20' : 'bg-[#00E5FF]/10'
                  }`}>
                    {m.role === 'user' ? <User size={14} className="text-[#7C4DFF]" /> : <Bot size={14} className="text-[#00E5FF]" />}
                  </div>
                  <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#7C4DFF]/20 text-white rounded-tr-sm'
                      : 'bg-white/5 text-white/80 rounded-tl-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#00E5FF]/10">
                    <Bot size={14} className="text-[#00E5FF]" />
                  </div>
                  <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]/60"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggested questions (only show before user sends anything) */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTED.map(q => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-xs px-2.5 py-1 rounded-full border border-[#00E5FF]/20 text-[#00E5FF]/70 hover:bg-[#00E5FF]/10 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-3 pb-3 pt-1 flex gap-2 border-t border-white/5">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about Sahaj…"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00E5FF]/40 transition-colors placeholder:text-white/20"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] transition-colors disabled:opacity-30"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.06 }}
        className="w-14 h-14 rounded-full flex items-center justify-center text-[#0A0A0A] font-bold shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #00E5FF, #7C4DFF)',
          boxShadow: '0 0 20px rgba(0,229,255,0.4)',
        }}
        aria-label="Toggle AI chat assistant"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={24} /></motion.span>
            : <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageCircle size={24} /></motion.span>
          }
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
