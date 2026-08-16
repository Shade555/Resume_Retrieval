const COMMON_SKILLS = [
  "react",
  "typescript",
  "javascript",
  "next.js",
  "node.js",
  "python",
  "java",
  "c++",
  "sql",
  "postgresql",
  "supabase",
  "tailwind",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "git",
  "redux",
  "graphql",
  "rest",
  "figma",
  "machine learning",
  "nlp",
  "pandas",
  "numpy",
];

function extractEmail(rawText: string): string | null {
  const match = rawText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : null;
}

function extractCandidateName(rawText: string): string | null {
  const lines = rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8);

  for (const line of lines) {
    if (line.includes("@") || line.length > 60) {
      continue;
    }

    if (/resume|curriculum vitae|profile/i.test(line)) {
      continue;
    }

    if (/^[A-Za-z][A-Za-z .'-]{1,58}$/.test(line)) {
      return line;
    }
  }

  return null;
}

function extractSkills(rawText: string): string[] {
  const normalizedText = rawText.toLowerCase();

  return COMMON_SKILLS.filter((skill) => normalizedText.includes(skill.toLowerCase()))
    .map((skill) => (skill === "next.js" ? "Next.js" : skill === "node.js" ? "Node.js" : skill.charAt(0).toUpperCase() + skill.slice(1)));
}

export function extractResumeMetadata(rawText: string) {
  return {
    candidateName: extractCandidateName(rawText),
    email: extractEmail(rawText),
    skills: extractSkills(rawText),
  };
}
