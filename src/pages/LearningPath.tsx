import { useState } from 'react'
import { LearningResource } from '../types'

const mockLearningPath: LearningResource[] = [
  {
    title: "Advanced React Patterns",
    provider: "Frontend Masters",
    duration: "6 hours",
    difficulty: "Advanced",
    url: "https://frontendmasters.com/courses/advanced-react-patterns/",
    skillsCovered: ["React", "Design Patterns", "Performance Optimization"]
  },
  {
    title: "Node.js Microservices",
    provider: "Udemy",
    duration: "12 hours",
    difficulty: "Intermediate",
    url: "https://www.udemy.com/course/nodejs-microservices/",
    skillsCovered: ["Node.js", "Microservices", "Docker"]
  },
  {
    title: "Full Stack Cloud Development",
    provider: "Coursera",
    duration: "3 months",
    difficulty: "Intermediate",
    url: "https://www.coursera.org/learn/cloud-development",
    skillsCovered: ["AWS", "Cloud Architecture", "DevOps"]
  }
]

export default function LearningPath() {
  const [resources] = useState<LearningResource[]>(mockLearningPath)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedDuration, setSelectedDuration] = useState<string>('all')

  const filteredResources = resources.filter(resource => {
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty.toLowerCase() === selectedDifficulty
    const matchesDuration = selectedDuration === 'all' || (
      selectedDuration === 'short' && resource.duration.includes('hours') ||
      selectedDuration === 'medium' && resource.duration.includes('weeks') ||
      selectedDuration === 'long' && resource.duration.includes('months')
    )
    return matchesDifficulty && matchesDuration
  })

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Personalized Learning Path</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="input-field"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <select
              id="duration"
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="input-field"
            >
              <option value="all">All Durations</option>
              <option value="short">Short (&lt; 1 week)</option>
              <option value="medium">Medium (1-4 weeks)</option>
              <option value="long">Long (&gt; 1 month)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredResources.map((resource, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{resource.title}</h3>
                  <p className="text-gray-600 mt-1">Provider: {resource.provider}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {resource.difficulty}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {resource.duration}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">Skills Covered:</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {resource.skillsCovered.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Start Learning
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 