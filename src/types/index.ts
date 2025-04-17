export interface Skill {
  name: string;
  proficiency: number;
  category: string;
}

export interface JobPosting {
  title: string;
  company: string;
  location: string;
  requiredSkills: string[];
  description: string;
  matchScore: number;
}

export interface LearningResource {
  title: string;
  provider: string;
  duration: string;
  difficulty: string;
  url: string;
  skillsCovered: string[];
}

export interface UserProfile {
  name: string;
  currentRole: string;
  skills: Skill[];
  targetRole?: string;
  learningProgress: {
    completedCourses: string[];
    inProgressCourses: string[];
  };
}

export interface SkillGap {
  missingSkills: string[];
  partialSkills: Array<{
    name: string;
    currentLevel: number;
    requiredLevel: number;
  }>;
  recommendations: LearningResource[];
} 