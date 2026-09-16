import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";
import ctTechLogo from "./assets/CT TECH LOGO transparent.png";
import webberImage from "./assets/Webber.jpeg";

type Project = {
  title: string;
  description: string;
  tags: string[];
  accent: string;
  icon: string;
  github: string;
  demo: string;
};
type GithubRepository = {
  name: string;
  html_url: string;
  description: string | null;
  updated_at: string;
};

const projects: Project[] = [
  {
    title: "EXTROO clothing brand website",
    description:
      "A modern, responsive e-commerce experience for EXTROO, built to showcase the brand and make shopping feel effortless.",
    tags: ["React", "Next.js", "Node.js", "Firebase"],
    accent: "violet",
    icon: "✦",
    github: "https://github.com/",
    demo: "https://extrooww.app",
  },
];

const birthDate = new Date(2007, 1, 18, 8, 43, 0);
const githubUsername = "cleophus18";

function getAge(now: Date) {
  const age = {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
  const cursor = new Date(birthDate);

  while (true) {
    const next = new Date(cursor);
    next.setFullYear(next.getFullYear() + 1);
    if (next > now) break;
    cursor.setTime(next.getTime());
    age.years += 1;
  }
  while (true) {
    const next = new Date(cursor);
    next.setMonth(next.getMonth() + 1);
    if (next > now) break;
    cursor.setTime(next.getTime());
    age.months += 1;
  }
  while (true) {
    const next = new Date(cursor);
    next.setDate(next.getDate() + 1);
    if (next > now) break;
    cursor.setTime(next.getTime());
    age.days += 1;
  }

  const remainingSeconds = Math.floor(
    (now.getTime() - cursor.getTime()) / 1000,
  );
  age.hours = Math.floor(remainingSeconds / 3600);
  age.minutes = Math.floor((remainingSeconds % 3600) / 60);
  age.seconds = remainingSeconds % 60;
  return age;
}

function AgeTimer() {
  const [now, setNow] = useState(() => new Date());
  const age = getAge(now);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="age-timer" aria-live="polite">
      <span>
        {age.years}y {age.months}mo {age.days}d
      </span>
      <span>
        {String(age.hours).padStart(2, "0")}h{" "}
        {String(age.minutes).padStart(2, "0")}m{" "}
        {String(age.seconds).padStart(2, "0")}s
      </span>
    </div>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return <div className="scroll-progress" style={{ width: `${progress}%` }} />;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [contributionVersion, setContributionVersion] = useState(() =>
    Date.now(),
  );
  const [githubRepositoryCount, setGithubRepositoryCount] = useState<number | null>(null);
  const [recentRepository, setRecentRepository] = useState<GithubRepository | null>(null);
  const [githubLoadError, setGithubLoadError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const email = "cleotshinyaleni@gmail.com";

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => setIsLoading(false), 3000);
    return () => window.clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    const contributionRefresh = window.setInterval(
      () => setContributionVersion(Date.now()),
      5 * 60 * 1000,
    );
    return () => window.clearInterval(contributionRefresh);
  }, []);

  useEffect(() => {
    const loadGithubRepositories = async () => {
      const profileResponse = await fetch(
        `https://api.github.com/users/${githubUsername}`,
      );
      if (!profileResponse.ok) {
        throw new Error("Unable to load GitHub profile");
      }
      const profile = (await profileResponse.json()) as { public_repos: number };
      setGithubRepositoryCount(profile.public_repos);

      const repositoriesResponse = await fetch(
        `https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc&per_page=1`,
      );
      if (!repositoriesResponse.ok) {
        throw new Error("Unable to load GitHub repositories");
      }
      const repositories = (await repositoriesResponse.json()) as GithubRepository[];
      setRecentRepository(repositories[0] ?? null);
    };

    void loadGithubRepositories().catch(() => setGithubLoadError(true));
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };
  const copyEmail = () => {
    if (!navigator.clipboard) {
      setCopied(false);
      return;
    }
    navigator.clipboard.writeText(email).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      },
      () => setCopied(false),
    );
  };
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {isLoading && (
        <div
          className="loading-screen"
          role="status"
          aria-label="Loading CT Tech portfolio"
        >
          <div className="loading-logo">
            <img src={ctTechLogo} alt="CT Tech" />
          </div>
          <p>Building thoughtful digital experiences</p>
          <div className="loading-bar" aria-hidden="true">
            <span />
          </div>
        </div>
      )}
      <div className="site-shell" aria-busy={isLoading}>
        <ScrollProgress />
        <header className="nav">
          <a className="brand" href="#age">
            Cleophus<span>.</span>
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i />
            <i />
            <i />
          </button>
          <nav className={menuOpen ? "open" : ""}>
            {["About", "Projects", "Experience", "Contact"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={closeMenu}
                >
                  {item}
                </a>
              ),
            )}
            <a className="nav-cta" href="#contact" onClick={closeMenu}>
              Let’s talk <span>↗</span>
            </a>
          </nav>
        </header>

        <main>
          <section className="profile-page" id="age">
            <div className="profile-page-content">
              <div className="profile-page-copy">
                <p className="kicker">Full-stack developer · South Africa</p>
                <h1>Cleophus Zwivhuya Tshinyaleni</h1>
                <div className="profile-page-details">
                  <span>Owner of CT Tech</span>
                  <span>Age</span>
                  <AgeTimer />
                </div>
                <p className="profile-page-ambition">
                  I’m here to help make South Africa more tech-based by
                  building useful, accessible digital products.
                </p>
              </div>
              <img
                className="profile-page-image"
                src={webberImage}
                alt="Cleophus Zwivhuya Tshinyaleni"
              />
            </div>
            <div className="contributions">
              <div className="contributions-heading">
                <span>GitHub contributions</span>
                <a
                  href={`https://github.com/${githubUsername}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  @{githubUsername} ↗
                </a>
              </div>
              <img
                className="contributions-image"
                src={`https://ghchart.rshah.org/168cff/${githubUsername}?v=${contributionVersion}`}
                alt={`GitHub contribution activity for ${githubUsername}`}
              />
            </div>
            <div className="github-summary">
              <div>
                <strong>{githubRepositoryCount ?? "—"}</strong>
                <span>public repositories</span>
              </div>
              <div className="recent-repository">
                <span>Recently updated</span>
                {recentRepository ? (
                  <a
                    href={recentRepository.html_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {recentRepository.name} ↗
                  </a>
                ) : githubLoadError ? (
                  <a href={`https://github.com/${githubUsername}`} target="_blank" rel="noreferrer">
                    View repositories ↗
                  </a>
                ) : (
                  <strong>Loading repository...</strong>
                )}
              </div>
            </div>
          </section>
          <section className="about-page section" id="about">
            <div className="section-intro">
              <span className="section-number">01</span>
              <p className="kicker">About me</p>
              <h2>
                Building with
                <br />
                <em>purpose.</em>
              </h2>
            </div>
            <div className="about-page-content">
              <p className="about-page-lede">
                I’m Cleophus, a full-stack developer and Computer Science
                student from South Africa.
              </p>
              <p>
                I enjoy turning ideas into useful digital products. As the
                owner of CT Tech, I create responsive web experiences while
                continuing to grow my skills in software engineering.
              </p>
              <p>
                I’m curious, practical, and always looking for better ways to
                build. I’m currently open to freelance work, internships, and
                collaborations.
              </p>
            </div>
          </section>
          <section className="projects section" id="projects">
            <div className="section-heading">
              <div>
                <span className="section-number">02</span>
                <p className="kicker">Selected work</p>
                <h2>
                  Things I’ve
                  <br />
                  <em>built recently.</em>
                </h2>
              </div>
              <a
                className="text-link view-all"
                href="https://extrooww.app"
                target="_blank"
                rel="noreferrer"
              >
                View all projects <span>↗</span>
              </a>
            </div>
            <div className="project-grid">
              {projects.map((project) => (
                <article
                  className="project-card"
                  key={project.title}
                  role="link"
                  tabIndex={0}
                  onClick={(event) => {
                    if (!(event.target as HTMLElement).closest("a"))
                      window.location.href = project.demo;
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter")
                      window.location.href = project.demo;
                  }}
                >
                  <div className={`project-visual ${project.accent}`}>
                    <span className="visual-icon">{project.icon}</span>
                    <span className="visual-lines">////</span>
                    <span className="project-index">
                      0{projects.indexOf(project) + 1} / 01
                    </span>
                  </div>
                  <div className="project-info">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="tags">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <div className="project-links">
                      <a href={project.github} target="_blank" rel="noreferrer">
                        GitHub <span>↗</span>
                      </a>
                      <a href={project.demo} target="_blank" rel="noreferrer">
                        Live demo <span>↗</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="experience section" id="experience">
            <div className="section-intro">
              <span className="section-number">03</span>
              <p className="kicker">Education & experience</p>
              <h2>
                Experience &<br />
                <em>education.</em>
              </h2>
            </div>
            <div className="timeline">
              <div className="timeline-item">
                <span className="timeline-date">2025 — Present</span>
                <div>
                  <h3>BSc Computer Science</h3>
                  <p className="muted">University of Venda · South Africa</p>
                  <p>
                    Bachelor of Computer Science · 2025 to present. Currently in
                    my second year, developing a strong foundation in software
                    engineering and web development.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <span className="timeline-date">Featured work</span>
                <div>
                  <h3>Full-stack web application</h3>
                  <p className="muted">
                    Personal project · Deployed with Render
                  </p>
                  <p>
                    Built and deployed a full-stack web application, created
                    responsive user interfaces, and used modern development
                    workflows with Git and GitHub.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <span className="timeline-date">Certification</span>
                <div>
                  <h3>MATLAB qualification</h3>
                  <p className="muted">Academic achievement</p>
                  <p>
                    Earned a MATLAB qualification while building practical
                    problem-solving and technical computing skills.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="contact section" id="contact">
            <div className="contact-copy">
              <span className="section-number">04</span>
              <p className="kicker">Have a project in mind?</p>
              <h2>
                Let’s make
                <br />
                <em>something great.</em>
              </h2>
              <p>
                I’m always open to hearing about new projects, ideas, or
                opportunities. Drop me a line and I’ll get back to you soon.
              </p>
              <div className="contact-actions">
                <a className="email-link" href={`mailto:${email}`}>
                  {email} <span>↗</span>
                </a>
                <button
                  className="copy-email"
                  type="button"
                  onClick={copyEmail}
                >
                  {copied ? "Copied!" : "Copy email"}
                </button>
              </div>
            </div>
            <form onSubmit={submit}>
              <label>
                Name
                <input required placeholder="Your name" />
              </label>
              <label>
                Email
                <input required type="email" placeholder="you@email.com" />
              </label>
              <label>
                Message
                <textarea
                  required
                  placeholder="Tell me a little about your project..."
                  rows={4}
                />
              </label>
              <button className="button primary" type="submit">
                {sent ? "Message sent ✓" : "Send message ↗"}
              </button>
            </form>
          </section>
        </main>
        <footer>
          <a className="brand" href="#age">
            Cleophus<span>.</span>
          </a>
          <p>© 2025 Cleophus Zwivhuya Tshinyelani. Created by CT TECH.</p>
          <div className="socials">
            <a
              href="https://github.com/cleophus18"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
            <a href="mailto:cleotshinyaleni@gmail.com">Email ↗</a>
          </div>
        </footer>
      </div>
    </>
  );
}
export default App;
