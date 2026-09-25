import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";
import SpaceBackground from "./SpaceBackground";
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
type SkillGroup = {
  title: string;
  icon: string;
  summary: string;
  skills: { name: string; level: number }[];
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
const emailAddress = "cleotshinyaleni@gmail.com";
/** Local format, shown to the user as-is. */
const phoneDisplay = "069 866 0259";
/** International format, required by tel: and wa.me links. */
const phoneE164 = "+27698660259";
const whatsappLink = `https://wa.me/${phoneE164.replace("+", "")}`;

const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    icon: "{ } ",
    summary: "The languages I reach for when solving problems.",
    skills: [
      { name: "TypeScript", level: 85 },
      { name: "JavaScript", level: 88 },
      { name: "HTML5 & CSS3", level: 92 },
    ],
  },
  {
    title: "Frontend",
    icon: "\u25a0",
    summary: "Building fast, responsive interfaces that feel effortless.",
    skills: [
      { name: "React", level: 88 },
      { name: "Next.js", level: 82 },
      { name: "Vite", level: 85 },
      { name: "Tailwind CSS", level: 80 },
      { name: "Responsive design", level: 90 },
    ],
  },
  {
    title: "Backend",
    icon: "\u2699",
    summary: "APIs and server logic that hold everything together.",
    skills: [
      { name: "Node.js", level: 85 },
      { name: "Express", level: 82 },
      { name: "REST APIs", level: 84 },
      { name: "Authentication & JWT", level: 75 },
    ],
  },
  {
    title: "Databases",
    icon: "\u25a4",
    summary: "Storing, shaping and querying application data.",
    skills: [
      { name: "Firebase / Firestore", level: 82 },
      { name: "MongoDB", level: 78 },
    ],
  },
  {
    title: "Tools & Platforms",
    icon: "\u2692",
    summary: "The daily workflow behind every project I ship.",
    skills: [
      { name: "Git & GitHub", level: 90 },
      { name: "VS Code", level: 92 },
      { name: "Postman", level: 80 },
      { name: "Render / Vercel", level: 78 },
      { name: "Figma", level: 72 },
      { name: "Linux CLI", level: 70 },
    ],
  },
];

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

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [contributionVersion, setContributionVersion] = useState(() =>
    Date.now(),
  );
  const [githubRepositoryCount, setGithubRepositoryCount] = useState<
    number | null
  >(null);
  const [recentRepository, setRecentRepository] =
    useState<GithubRepository | null>(null);
  const [githubLoadError, setGithubLoadError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const email = emailAddress;

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
      try {
        const profileResponse = await fetch(
          `https://api.github.com/users/${githubUsername}`,
        );
        if (!profileResponse.ok) {
          throw new Error("Unable to load GitHub profile");
        }
        const profile = (await profileResponse.json()) as {
          public_repos: number;
        };
        setGithubRepositoryCount(profile.public_repos);

        const repositoriesResponse = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc&per_page=1`,
        );
        if (!repositoriesResponse.ok) {
          throw new Error("Unable to load GitHub repositories");
        }
        const repositories =
          (await repositoriesResponse.json()) as GithubRepository[];
        setRecentRepository(repositories[0] ?? null);
        setGithubLoadError(false);
      } catch {
        // Unauthenticated GitHub API calls are rate limited (HTTP 403), and
        // browsers block them offline. Fall back instead of throwing.
        setGithubLoadError(true);
      }
    };

    void loadGithubRepositories();

    // Retry once after a short delay: the public GitHub API returns 403 when
    // the shared IP is rate limited, which is usually temporary.
    const retry = window.setTimeout(() => {
      void loadGithubRepositories();
    }, 15000);
    return () => window.clearTimeout(retry);
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };
  const copyText = (value: string, done: (ok: boolean) => void) => {
    if (!navigator.clipboard) {
      done(false);
      return;
    }
    navigator.clipboard.writeText(value).then(
      () => {
        done(true);
        window.setTimeout(() => done(false), 2200);
      },
      () => done(false),
    );
  };
  const copyEmail = () => copyText(email, setCopied);
  const copyPhone = () => copyText(phoneDisplay, setCopiedPhone);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <SpaceBackground />
      {isLoading && (
        <div
          className="loading-screen"
          role="status"
          aria-label="Loading CT Tech portfolio"
        >
          <div className="loading-logo">
            <img src={ctTechLogo} alt="CT Tech" />
          </div>
          <div className="loading-bar" aria-hidden="true">
            <span />
          </div>
        </div>
      )}
      <div className="site-shell" aria-busy={isLoading}>
        <header className="nav">
          <a className="brand" href="#age">
            <img className="brand-mark" src={ctTechLogo} alt="" />
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
            {["About", "Projects", "Experience", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={closeMenu}>
                {item}
              </a>
            ))}
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
                  I’m here to help make South Africa more tech-based by building
                  useful, accessible digital products.
                </p>
                <div className="hero-contact">
                  <a
                    className="lets-talk"
                    href={`mailto:${emailAddress}?subject=Let%E2%80%99s%20talk%20%E2%80%94%20project%20enquiry`}
                  >
                    <span className="lets-talk-label">Let’s talk</span>
                    <span className="lets-talk-value">{emailAddress}</span>
                    <span className="lets-talk-arrow">↗</span>
                  </a>
                  <div className="hero-contact-alt">
                    <span>or call me</span>
                    <a className="phone-link" href={`tel:${phoneE164}`}>
                      {phoneDisplay}
                    </a>
                  </div>
                </div>
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
                <strong>
                  {githubRepositoryCount ?? (githubLoadError ? "—" : "…")}
                </strong>
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
                  <a
                    href={`https://github.com/${githubUsername}`}
                    target="_blank"
                    rel="noreferrer"
                  >
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
                I enjoy turning ideas into useful digital products. As the owner
                of CT Tech, I create responsive web experiences while continuing
                to grow my skills in software engineering.
              </p>
              <p>
                I’m curious, practical, and always looking for better ways to
                build. I’m currently open to freelance work, internships, and
                collaborations.
              </p>
            </div>
            <div className="skills">
              <div className="skills-heading">
                <span className="section-number">02</span>
                <p className="kicker">Skills & tools</p>
                <h3>
                  What I build
                  <br />
                  <em>with.</em>
                </h3>
              </div>
              <div className="skill-grid">
                {skillGroups.map((group) => (
                  <article className="skill-group" key={group.title}>
                    <header>
                      <span className="skill-group-icon" aria-hidden="true">
                        {group.icon}
                      </span>
                      <h4>{group.title}</h4>
                    </header>
                    <p className="skill-summary">{group.summary}</p>
                    <ul>
                      {group.skills.map((skill) => (
                        <li key={skill.name}>
                          <div className="skill-row">
                            <span>{skill.name}</span>
                            <span className="skill-level">{skill.level}%</span>
                          </div>
                          <div
                            className="skill-meter"
                            role="progressbar"
                            aria-valuenow={skill.level}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${skill.name} proficiency`}
                          >
                            <span style={{ width: `${skill.level}%` }} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>
          <section className="projects section" id="projects">
            <div className="section-heading">
              <div>
                <span className="section-number">03</span>
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
              <span className="section-number">04</span>
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
              <span className="section-number">05</span>
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
              <div className="contact-phone">
                <span className="kicker">Prefer to call or WhatsApp?</span>
                <a className="phone-number" href={`tel:${phoneE164}`}>
                  {phoneDisplay}
                </a>
                <div className="contact-actions">
                  <a className="button primary" href={`tel:${phoneE164}`}>
                    Call now ↗
                  </a>
                  <a
                    className="button ghost"
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp ↗
                  </a>
                  <button
                    className="copy-email"
                    type="button"
                    onClick={copyPhone}
                  >
                    {copiedPhone ? "Copied!" : "Copy number"}
                  </button>
                </div>
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
            <a href={`mailto:${emailAddress}`}>Email ↗</a>
            <a href={`tel:${phoneE164}`}>{phoneDisplay}</a>
          </div>
        </footer>
      </div>
    </>
  );
}
export default App;
