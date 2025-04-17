import { useState } from 'react'
import { JobPosting } from '../types'

const mockJobs: JobPosting[] = [
  {
    title: "Senior Full Stack Developer",
    company: "TechCorp",
    location: "Remote",
    requiredSkills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
    description: "We are looking for a Senior Full Stack Developer to join our growing team. The ideal candidate will have strong experience with modern web technologies and cloud platforms.",
    matchScore: 85
  },
  {
    title: "Frontend Developer",
    company: "DesignStudio",
    location: "Karachi, Pakistan",
    requiredSkills: ["React", "TypeScript", "CSS", "UI/UX"],
    description: "Join our creative team as a Frontend Developer. Focus on building beautiful and responsive user interfaces for our clients.",
    matchScore: 90
  },
  {
    title: "Backend Developer",
    company: "DataSys",
    location: "Lahore, Pakistan",
    requiredSkills: ["Node.js", "Python", "MongoDB", "Docker"],
    description: "Looking for a Backend Developer to help build scalable microservices and APIs.",
    matchScore: 75
  }
]

export default function JobMatches() {
  const [jobs] = useState<JobPosting[]>(mockJobs)
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [minMatchScore, setMinMatchScore] = useState<number>(0)

  const filteredJobs = jobs
    .filter(job => 
      (locationFilter === 'all' || job.location.toLowerCase().includes(locationFilter.toLowerCase())) &&
      job.matchScore >= minMatchScore
    )
    .sort((a, b) => b.matchScore - a.matchScore)

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Matches</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              id="location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Locations</option>
              <option value="remote">Remote</option>
              <option value="karachi">Karachi</option>
              <option value="lahore">Lahore</option>
              <option value="islamabad">Islamabad</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="matchScore" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Match Score
            </label>
            <input
              type="range"
              id="matchScore"
              min="0"
              max="100"
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>0%</span>
              <span>{minMatchScore}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-gray-600 text-sm mt-1">{job.location}</p>
                </div>
                <div className="flex items-center">
                  <div className="text-right">
                    <span className="text-sm text-gray-600">Match Score</span>
                    <div className="text-2xl font-bold text-blue-600">{job.matchScore}%</div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-gray-600">{job.description}</p>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">Required Skills:</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button className="btn-primary">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 