// ─── Industry-grade job matching utility ────────────────────────────────────
// Weights:  Skills 40 | Role 25 | Experience 15 | Location 10 | Education 10

// ─── Curated tech skill vocabulary ──────────────────────────────────────────
const KNOWN_TECH_SKILLS = new Set([
  // Languages
  "javascript","typescript","python","java","c","c++","c#","go","golang","rust","ruby","php",
  "swift","kotlin","scala","r","matlab","perl","bash","shell","groovy","dart","elixir",
  // Frontend
  "react","angular","vue","vue.js","nextjs","next.js","nuxt","svelte","html","css","sass","scss",
  "tailwind","bootstrap","webpack","vite","redux","mobx","recoil","graphql","apollo",
  // Backend
  "node","node.js","express","fastapi","django","flask","spring","springboot","laravel",
  "rails","ruby on rails","asp.net","nestjs","hapi","koa","gin","fiber","actix",
  // Mobile
  "react native","flutter","android","ios","xcode","swift","kotlin","jetpack compose","swiftui",
  // Databases
  "sql","mysql","postgresql","postgres","mongodb","redis","cassandra","dynamodb","sqlite",
  "elasticsearch","neo4j","couchdb","mariadb","oracle","mssql",
  // Cloud / DevOps
  "aws","gcp","azure","docker","kubernetes","k8s","terraform","ansible","jenkins","github actions",
  "ci/cd","linux","nginx","apache","heroku","vercel","netlify","cloudflare",
  // Data / ML / AI
  "machine learning","deep learning","tensorflow","pytorch","keras","scikit-learn","pandas",
  "numpy","nlp","computer vision","llm","langchain","openai","huggingface","spark","hadoop",
  "tableau","power bi","data science","data engineering","airflow","dbt","kafka","flink",
  // Tools
  "git","github","gitlab","bitbucket","jira","confluence","figma","postman","swagger",
  "rest","rest api","graphql","grpc","websocket","oauth","jwt","microservices","monorepo",
  "agile","scrum","tdd","bdd","ci","cd",
]);

// ─── Skill relatives (partial credit for closely related skills) ─────────────
const SKILL_RELATIVES: Record<string, string[]> = {
  react:       ["vue","angular","svelte","nextjs"],
  angular:     ["react","vue","svelte"],
  vue:         ["react","angular","svelte","nuxt"],
  nextjs:      ["react","nuxt","svelte"],
  node:        ["express","nestjs","fastapi"],
  "node.js":   ["express","nestjs"],
  express:     ["node","node.js","fastapi","django","flask"],
  django:      ["flask","fastapi","rails"],
  flask:       ["django","fastapi"],
  fastapi:     ["django","flask","express"],
  python:      ["r","scala"],
  javascript:  ["typescript"],
  typescript:  ["javascript"],
  java:        ["kotlin","scala","c#"],
  kotlin:      ["java","swift"],
  swift:       ["kotlin","objective-c"],
  postgresql:  ["mysql","mariadb","mssql"],
  mysql:       ["postgresql","mariadb","sqlite"],
  mongodb:     ["couchdb","dynamodb","cassandra"],
  redis:       ["memcached"],
  kubernetes:  ["docker"],
  docker:      ["kubernetes","k8s"],
  aws:         ["gcp","azure"],
  gcp:         ["aws","azure"],
  azure:       ["aws","gcp"],
  "react native": ["flutter"],
  flutter:     ["react native"],
};

// ─── Seniority indicators ────────────────────────────────────────────────────
const SENIOR_INDICATORS = ["senior","sr.","lead","principal","staff","manager","head","director","vp","architect","expert"];
const ENTRY_INDICATORS  = ["junior","jr.","fresher","entry","intern","trainee","graduate","associate","0-1 year","0-2 year"];

function parseYearsRequired(text: string): number {
  const m = text.match(/(\d+)\s*[-–to]+\s*(\d+)\s*(?:years?|yrs?)/i) || text.match(/(\d+)\+?\s*(?:years?|yrs?)/i);
  if (!m) return 0;
  return parseInt(m[1]);
}

function normalizeSkills(raw: string[]): string[] {
  return raw.flatMap(s => s.split(/[,;|/]+/)).map(s => s.trim().toLowerCase()).filter(s => s.length > 1 && KNOWN_TECH_SKILLS.has(s));
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORING DIMENSIONS
// ─────────────────────────────────────────────────────────────────────────────
const PARTIAL_CREDIT = 0.35;
const MIN_SKILL_DENOM = 5;

function scoreSkillFit(studentSkills: string[], jobSkills: string[]): { score: number; matched: string[]; missing: string[] } {
  if (jobSkills.length === 0) return { score: 20, matched: [], missing: [] };

  const studentSet = new Set(studentSkills);
  const matched: string[] = [];
  const missing: string[] = [];
  let points = 0;

  for (const skill of jobSkills) {
    if (studentSet.has(skill)) {
      points += 1;
      matched.push(skill);
    } else {
      const relatives = SKILL_RELATIVES[skill] || [];
      if (relatives.some(r => studentSet.has(r))) {
        points += PARTIAL_CREDIT;
      } else {
        missing.push(skill);
      }
    }
  }

  const denom = Math.max(jobSkills.length, MIN_SKILL_DENOM);
  const raw = points / denom;
  return { score: Math.round(Math.min(raw, 1) * 40), matched, missing };
}

function scoreRoleFit(studentInterest: string, jobTitle: string, jobDesc: string): number {
  const title  = jobTitle.toLowerCase();
  const desc   = jobDesc.toLowerCase();
  const interest = studentInterest.toLowerCase();
  if (!interest) return 10;

  const interestTokens = interest.split(/\s+/);
  let hits = interestTokens.filter(t => t.length > 2 && (title.includes(t) || desc.includes(t))).length;
  const overlap = Math.min(hits / Math.max(interestTokens.length, 1), 1);
  return Math.round(overlap * 25);
}

function scoreExpFit(studentWorkExps: { role: string; description?: string | null }[], jobTitle: string, jobDesc: string): number {
  if (studentWorkExps.length === 0) return 8; // neutral — no info
  const combined = (jobTitle + " " + jobDesc).toLowerCase();
  let score = 8;
  for (const exp of studentWorkExps) {
    const expText = (exp.role + " " + (exp.description || "")).toLowerCase();
    const overlap = expText.split(/\s+/).filter(t => t.length > 3 && combined.includes(t)).length;
    if (overlap >= 3) { score = 15; break; }
    if (overlap >= 1) { score = Math.max(score, 11); }
  }
  return score;
}

function scoreLocationFit(studentLocations: string[], jobLocation: string | null | undefined): number {
  if (!jobLocation || jobLocation.toLowerCase().includes("remote")) return 8;
  if (studentLocations.length === 0) return 5;
  const jobLoc = jobLocation.toLowerCase();
  return studentLocations.some(l => jobLoc.includes(l.toLowerCase()) || l.toLowerCase().includes(jobLoc)) ? 10 : 3;
}

function scoreEducationFit(degree: string | null | undefined, branch: string | null | undefined, jobDesc: string): number {
  if (!degree && !branch) return 5;
  const desc = jobDesc.toLowerCase();
  let score = 5;
  if (degree && desc.includes(degree.toLowerCase())) score += 2;
  if (branch) {
    const branchTokens = branch.toLowerCase().split(/\s+/);
    if (branchTokens.some(t => t.length > 2 && desc.includes(t))) score += 3;
  }
  return Math.min(score, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

export interface StudentProfile {
  skills: string[];
  jobRoleInterest: string | null;
  degree: string | null;
  branch: string | null;
  preferredLocations: string[];
  workExperiences: { role: string; description?: string | null }[];
  projects: { title: string; techStack: string[] }[];
}

export interface MatchBreakdown {
  skillMatch: number;
  roleMatch: number;
  jobTypeMatch: number;   // experience dimension
  locationMatch: number;
  experienceMatch: number; // education dimension
}

export interface OnCampusMatchResult {
  job: any;
  matchScore: number;
  breakdown: MatchBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface OffCampusMatchResult {
  job: any;
  matchScore: number;
  breakdown: MatchBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
}

export function matchOnCampusJob(student: StudentProfile, job: any): OnCampusMatchResult {
  const studentSkills = normalizeSkills(student.skills);
  const jobSkills     = normalizeSkills(job.requiredSkills || []);
  const desc          = job.jobDescription || "";

  const skill    = scoreSkillFit(studentSkills, jobSkills);
  const role     = scoreRoleFit(student.jobRoleInterest || "", job.title || "", desc);
  const exp      = scoreExpFit(student.workExperiences, job.title || "", desc);
  const location = scoreLocationFit(student.preferredLocations, job.jobLocation);
  const education = scoreEducationFit(student.degree, student.branch, desc);

  const total = skill.score + role + exp + location + education;

  return {
    job,
    matchScore: Math.min(total, 100),
    breakdown: {
      skillMatch: skill.score,
      roleMatch: role,
      jobTypeMatch: exp,
      locationMatch: location,
      experienceMatch: education,
    },
    matchedSkills: skill.matched,
    missingSkills: skill.missing,
  };
}

export function matchOffCampusJob(student: StudentProfile, job: any): OffCampusMatchResult {
  const studentSkills = normalizeSkills(student.skills);

  // Extract job skills from description + title
  const combined = ((job.job_title || "") + " " + (job.description || "")).toLowerCase();
  const jobSkills: string[] = [];
  for (const sk of KNOWN_TECH_SKILLS) {
    if (combined.includes(sk)) jobSkills.push(sk);
  }

  const skill    = scoreSkillFit(studentSkills, jobSkills);
  const role     = scoreRoleFit(student.jobRoleInterest || "", job.job_title || "", job.description || "");
  const exp      = scoreExpFit(student.workExperiences, job.job_title || "", job.description || "");
  const location = scoreLocationFit(student.preferredLocations, job.location);
  const education = scoreEducationFit(student.degree, student.branch, job.description || "");

  const total = skill.score + role + exp + location + education;

  // Compute zone: jobs scraped within 30 days are "active"
  const scrapedAt = job.scraped_at ? new Date(job.scraped_at) : new Date();
  const daysDiff = (Date.now() - scrapedAt.getTime()) / (1000 * 60 * 60 * 24);
  const zone = daysDiff <= 30 ? "active" : "inactive";

  return {
    job: { ...job, zone },
    matchScore: Math.min(total, 100),
    breakdown: {
      skillMatch: skill.score,
      roleMatch: role,
      jobTypeMatch: exp,
      locationMatch: location,
      experienceMatch: education,
    },
    matchedSkills: skill.matched,
    missingSkills: skill.missing,
  };
}
