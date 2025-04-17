import { useState } from 'react'
import { SkillGap, UserProfile } from '../types'

const AVAILABLE_ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Cloud Architect",
  "Mobile App Developer",
  "UI/UX Designer",
  "Product Manager",
  "Software Architect",
  "Blockchain Developer",
  "Security Engineer",
  "QA Engineer",
  "Technical Lead"
]

const mockUserProfile: UserProfile = {
  name: "John Doe",
  currentRole: "Frontend Developer",
  skills: [
    { name: "React", proficiency: 80, category: "Frontend" },
    { name: "TypeScript", proficiency: 75, category: "Programming" },
    { name: "Node.js", proficiency: 60, category: "Backend" },
    { name: "Python", proficiency: 50, category: "Programming" },
  ],
  targetRole: "Full Stack Developer",
  learningProgress: {
    completedCourses: ["React Fundamentals", "TypeScript Basics"],
    inProgressCourses: ["Node.js Advanced", "Python for Web Development"]
  }
}

export default function SkillAnalysis() {
  const [userProfile] = useState<UserProfile>(mockUserProfile)
  const [targetRole, setTargetRole] = useState(userProfile.targetRole || AVAILABLE_ROLES[0])
  const [skillGap, setSkillGap] = useState<SkillGap | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeSkillGap = async () => {
    setIsAnalyzing(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:5000/api/analyze-skill-gap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: targetRole,
          skills: userProfile.skills,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze skill gap')
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      setSkillGap(data)
    } catch (error) {
      console.error('Error analyzing skill gap:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
      // Remove the fallback mock data to see actual errors
    }
    setIsAnalyzing(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Skill Gap Analysis</h2>
        <div className="max-w-xl">
          <div className="mb-4">
            <label htmlFor="targetRole" className="block text-sm font-medium text-gray-700">
              Target Role
            </label>
            <select
              id="targetRole"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {AVAILABLE_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={analyzeSkillGap}
            disabled={isAnalyzing || !targetRole}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Skill Gap'}
          </button>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>

      {skillGap && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Analysis Results</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Missing Skills</h4>
              <ul className="list-disc list-inside space-y-1">
                {skillGap.missingSkills.map((skill, index) => (
                  <li key={index} className="text-gray-600">{skill}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Skills to Improve</h4>
              <div className="space-y-2">
                {skillGap.partialSkills.map((skill, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">{skill.name}</span>
                      <span className="text-gray-500">
                        Current: {skill.currentLevel}% / Required: {skill.requiredLevel}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(skill.currentLevel / skill.requiredLevel) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Recommended Resources</h4>
              <div className="grid grid-cols-1 gap-4">
                {skillGap.recommendations.map((resource, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900">{resource.title}</h5>
                    <p className="text-gray-600 text-sm mt-1">Provider: {resource.provider}</p>
                    <div className="flex space-x-4 text-sm text-gray-500 mt-2">
                      <span>Duration: {resource.duration}</span>
                      <span>Difficulty: {resource.difficulty}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">Skills covered:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {resource.skillsCovered.map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      Learn more
                      <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 