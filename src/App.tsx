import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Github, Code2, Trophy, ExternalLink, Mail, Linkedin, Terminal as TerminalIcon, ChevronRight, BookOpen, Cpu, Shield, Brain } from 'lucide-react';
import HeroBackground from './components/HeroBackground';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Section = ({ children, id, className }: { children: React.ReactNode; id?: string; className?: string }) => (
  <section id={id} className={cn("py-24 px-6 max-w-7xl mx-auto", className)}>
    {children}
  </section>
);

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("glass rounded-2xl p-6 transition-all duration-300 hover:border-primary/50", className)}>
    {children}
  </div>
);

export default function App() {
  const [stats, setStats] = useState<any>(null);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['Welcome to Sahaj\'s Terminal. Type "help" for commands.']);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  const handleTerminal = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.toLowerCase().trim();
    let output = '';
    switch (cmd) {
      case 'help': output = 'Available commands: about, projects, research, skills, clear'; break;
      case 'about': output = 'Sahaj Saliya: B.Tech ICT student @ PDEU (GPA: 8.5). ML & Systems Researcher.'; break;
      case 'projects': output = 'Chakhdi-Sentry AI, SentinelProxy Suite, Microplastic Detection, Python Tools...'; break;
      case 'research': output = 'IEEE AIMV 2025: Deepfake Audio Detection, Crime Prediction Framework.'; break;
      case 'skills': output = 'Python, ML, Node.js, Systems Security, Networking, Docker...'; break;
      case 'clear': setTerminalOutput([]); setTerminalInput(''); return;
      default: output = `Command not found: ${cmd}`;
    }
    setTerminalOutput(prev => [...prev, `> ${terminalInput}`, output]);
    setTerminalInput('');
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-none bg-bg/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-mono font-bold text-xl tracking-tighter">
            SAHAJ<span className="text-primary">.</span>SALIYA
          </span>
          <div className="hidden md:flex gap-8 text-sm font-medium text-white/60">
            {['About', 'Interests', 'Stats', 'Projects', 'Research', 'Timeline', 'Skills', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-primary transition-colors">{item}</a>
            ))}
          </div>
          <a href="https://github.com/SahajIVVIX-1" target="_blank" rel="noreferrer" className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Github size={20} />
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6">
        <HeroBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4">
            Sahaj <span className="text-gradient">Saliya</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/60 font-mono mb-8">
            Machine Learning • Systems • Security
          </p>
          <p className="max-w-xl mx-auto text-white/40 mb-12">
            Exploring the mathematical foundations and systems engineering behind next-generation intelligent systems.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#projects" className="px-8 py-3 bg-primary text-bg font-bold rounded-full hover:scale-105 transition-transform">
              View Projects
            </a>
            <a href="https://github.com/SahajIVVIX-1" className="px-8 py-3 glass font-bold rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
              <Github size={20} /> GitHub
            </a>
          </div>
        </motion.div>
        <div className="absolute bottom-10 animate-bounce text-white/20">
          <ChevronRight size={32} className="rotate-90" />
        </div>
      </section>

      {/* About */}
      <Section id="about">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">About Me</h2>
            <p className="text-white/60 text-lg leading-relaxed mb-6">
              I am a B.Tech ICT student at PDEU (GPA: 8.5/10.0), exploring the intersection of mathematical theory and practical systems implementation. My work bridges the gap between high-level AI research and low-level systems security.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen, label: 'PDEU ICT', sub: '2023 – 2027' },
                { icon: Brain, label: 'ML Research', sub: 'Deep Learning' },
                { icon: Shield, label: 'Security', sub: 'Autonomous Systems' },
                { icon: Cpu, label: 'Systems', sub: 'Engineering' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 glass rounded-xl">
                  <item.icon className="text-primary" size={24} />
                  <div>
                    <div className="font-bold text-sm">{item.label}</div>
                    <div className="text-xs text-white/40">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="relative aspect-square rounded-3xl overflow-hidden glass p-2">
            <img 
              src="https://picsum.photos/seed/sahaj/800/800" 
              alt="Profile" 
              className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </Section>

      {/* Scientific Interests */}
      <Section id="interests" className="bg-white/[0.02]">
        <h2 className="text-4xl font-bold mb-12 text-center">Scientific Interests</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: 'Machine Learning', desc: 'EDA, Probability & Statistics, Linear Algebra.', color: 'primary' },
            { title: 'Deep Learning', desc: 'Neural networks & representation learning.', color: 'secondary' },
            { title: 'Computer Vision', desc: 'Object detection (YOLOv11) & spectral analysis.', color: 'primary' },
            { title: 'Systems & Security', desc: 'Networking, OS security & autonomous defense.', color: 'secondary' },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="h-full flex flex-col justify-between border-white/5 hover:border-primary/20">
                <div>
                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", 
                    item.color === 'primary' ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                  )}>
                    {i === 0 && <Brain size={24} />}
                    {i === 1 && <Cpu size={24} />}
                    {i === 2 && <BookOpen size={24} />}
                    {i === 3 && <Shield size={24} />}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/40 text-sm">{item.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Coding Dashboard */}
      <Section id="stats">
        <h2 className="text-4xl font-bold mb-12">Coding Activity</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-primary">
            <div className="flex items-center gap-4 mb-6">
              <Github className="text-primary" size={32} />
              <h3 className="text-2xl font-bold">GitHub</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-white/40">Repositories</span>
                <span className="font-mono text-primary">{stats?.github?.repos || '42'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Followers</span>
                <span className="font-mono text-primary">{stats?.github?.followers || '12'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Commits (2025)</span>
                <span className="font-mono text-primary">850+</span>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <div className="flex items-center gap-4 mb-6">
              <Code2 className="text-secondary" size={32} />
              <h3 className="text-2xl font-bold">LeetCode</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-white/40">Solved</span>
                <span className="font-mono text-secondary">{stats?.leetcode?.totalSolved || '320'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Ranking</span>
                <span className="font-mono text-secondary">{stats?.leetcode?.ranking || '12,000'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Acceptance Rate</span>
                <span className="font-mono text-secondary">{stats?.leetcode?.acceptanceRate || '65'}%</span>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <div className="flex items-center gap-4 mb-6">
              <Trophy className="text-primary" size={32} />
              <h3 className="text-2xl font-bold">Codeforces</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-white/40">Rating</span>
                <span className="font-mono text-primary">{stats?.codeforces?.rating || '1450'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Max Rating</span>
                <span className="font-mono text-primary">{stats?.codeforces?.maxRating || '1520'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Rank</span>
                <span className="font-mono text-primary capitalize">{stats?.codeforces?.rank || 'Specialist'}</span>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects">
        <h2 className="text-4xl font-bold mb-12">Featured Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: 'Chakhdi-Sentry AI',
              desc: 'Autonomous security guardian that hunts vulnerabilities using ML to neutralize threats.',
              tech: ['Python 3', 'Scikit-Learn', 'BeautifulSoup4', 'Pandas'],
              link: 'https://github.com/SahajIVVIX-1'
            },
            {
              title: 'SentinelProxy Suite',
              desc: 'AI-driven Windows-based Node.js gateway with transparent HTTPS proxying and DNS resolution.',
              tech: ['Node.js', 'Socket.IO', 'SQLite', 'DNS', 'PowerShell'],
              link: 'https://github.com/SahajIVVIX-1'
            },
            {
              title: 'Microplastic Detection System',
              desc: 'YOLOv11 object detection model to detect microplastic particles from visual data.',
              tech: ['Python', 'YOLOv11', 'PyTorch', 'OpenCV', 'CUDA'],
              link: '#'
            },
            {
              title: 'Python Productivity Tools',
              desc: 'Smaran (Smart Reminder), PyEnv Launcher, and Digital Hand Cricket game suite.',
              tech: ['Python', 'PyQt6', 'Git', 'Windows Registry'],
              link: 'https://github.com/SahajIVVIX-1'
            }
          ].map((project, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }}>
              <Card className="p-0 overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink size={48} className="text-white" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-white/40 mb-6">{project.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map(t => (
                      <span key={t} className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono text-primary">{t}</span>
                    ))}
                  </div>
                  <a href={project.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors">
                    View Project <ChevronRight size={16} />
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Research */}
      <Section id="research" className="bg-white/[0.02]">
        <h2 className="text-4xl font-bold mb-12">Research & Publications</h2>
        <div className="space-y-6">
          {[
            { title: 'Deepfake Audio Detection using Deep Learning', venue: 'IEEE AIMV 2025', status: 'Presented', doi: '10.1109/AIMV66517.2025.11203307' },
            { title: 'Intelligent Cognitive Frameworks for Crime Prediction in Smart Cities', venue: 'IEEE AIMV 2025', status: 'Presented', doi: '10.1109/AIMV66517.2025.11203581' },
          ].map((paper, i) => (
            <Card key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-1">{paper.title}</h3>
                <p className="text-white/40 font-mono text-sm">{paper.venue}</p>
                <p className="text-primary/60 text-xs mt-1">DOI: {paper.doi}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{paper.status}</span>
                <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noreferrer" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <ExternalLink size={20} />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section id="timeline">
        <h2 className="text-4xl font-bold mb-12">Timeline & Involvement</h2>
        <div className="relative border-l border-white/10 ml-4 pl-8 space-y-12">
          {[
            { year: '2025', title: 'IEEE Conference Presentation', desc: 'Presented two papers at 2nd IEEE Conference on AIMV.' },
            { year: '2025', title: 'Vertex AI & Firebase Workshop', desc: 'Fine-tuned Gemini 1.5 Pro at GDG Gandhinagar session.' },
            { year: '2024', title: 'Code4Cause Hackathon', desc: 'National-level hackathon participation in Delhi.' },
            { year: '2023', title: 'Started B.Tech ICT', desc: 'Began journey at PDEU Gandhinagar.' },
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-bg" />
              <div className="text-primary font-mono text-sm mb-1">{item.year}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-white/40">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Skills & Certifications */}
      <Section id="skills" className="bg-white/[0.02]">
        <h2 className="text-4xl font-bold mb-12">Skills & Certifications</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Cpu className="text-primary" /> Technical Skills</h3>
            <div className="space-y-6">
              {[
                { label: 'Languages', skills: 'Python (Adv), C/C++, MATLAB, SQL, Java, JS' },
                { label: 'Frameworks', skills: 'Node.js, React, Flask, MySQL, MongoDB, Docker' },
                { label: 'Systems', skills: 'Networking, Windows/Linux Admin, Firewalls' },
                { label: 'Tools', skills: 'Power BI, Excel (VBA), Notion, Prompt Engineering' },
              ].map((group, i) => (
                <div key={i}>
                  <div className="text-sm font-bold text-white/60 mb-2 uppercase tracking-wider">{group.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.split(', ').map(skill => (
                      <span key={skill} className="px-3 py-1 glass rounded-full text-xs">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Trophy className="text-secondary" /> Certifications</h3>
            <div className="space-y-4">
              {[
                { title: 'Deep Learning', issuer: 'NPTEL – IIT Ropar', score: '66%' },
                { title: 'AI/ML for Geodata Analysis', issuer: 'IISRO-IIRS (ISRO)', score: null },
                { title: 'Code4Cause Hackathon 2.0', issuer: 'National-level', score: null },
                { title: 'Signal Processing Onramp', issuer: 'Applied MATLAB', score: null },
              ].map((cert, i) => (
                <Card key={i} className="py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold">{cert.title}</div>
                      <div className="text-xs text-white/40">{cert.issuer}</div>
                    </div>
                    {cert.score && <div className="text-primary font-mono font-bold">{cert.score}</div>}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Terminal Interface */}
      <Section id="terminal">
        <Card className="p-0 bg-black border-white/10 overflow-hidden">
          <div className="bg-white/5 px-4 py-2 flex items-center gap-2 border-b border-white/10">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
            <span className="ml-4 text-xs font-mono text-white/40">sahaj@portfolio ~ zsh</span>
          </div>
          <div className="p-6 font-mono text-sm h-64 overflow-y-auto">
            {terminalOutput.map((line, i) => (
              <div key={i} className={cn("mb-1", line.startsWith('>') ? "text-primary" : "text-white/60")}>
                {line}
              </div>
            ))}
            <form onSubmit={handleTerminal} className="flex items-center gap-2">
              <span className="text-primary">❯</span>
              <input 
                type="text" 
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-white"
                autoFocus
              />
            </form>
          </div>
        </Card>
      </Section>

      {/* Contact */}
      <Section id="contact" className="text-center">
        <h2 className="text-4xl font-bold mb-6">Let's Connect</h2>
        <p className="text-white/40 mb-12 max-w-lg mx-auto">
          Interested in research collaboration or systems engineering projects? Feel free to reach out.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { icon: Mail, label: 'Email', href: 'mailto:sahajs59@gmail.com' },
            { icon: Linkedin, label: 'LinkedIn', href: 'https://in.linkedin.com/in/sahajs59' },
            { icon: Github, label: 'GitHub', href: 'https://github.com/SahajIVVIX-1' },
            { icon: BookOpen, label: 'Medium', href: 'https://sahajs59.medium.com/' },
            { icon: TerminalIcon, label: 'Resume', href: '#' },
          ].map((item, i) => (
            <a 
              key={i} 
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-6 py-3 glass rounded-full hover:bg-white/10 transition-colors"
            >
              <item.icon size={20} className="text-primary" />
              <span className="font-bold">{item.label}</span>
            </a>
          ))}
        </div>
      </Section>

      <footer className="py-12 border-t border-white/5 text-center text-white/20 text-sm font-mono">
        © 2025 SAHAJ SALIYA • BUILT WITH REACT & THREE.JS
      </footer>
    </div>
  );
}
