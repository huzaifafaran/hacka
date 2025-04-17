import { useState } from 'react'
import { UserProfile } from '../types'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

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

export default function Dashboard() {
  const [userProfile] = useState<UserProfile>(mockUserProfile)

  const skillChartData = {
    labels: userProfile.skills.map(skill => skill.name),
    datasets: [
      {
        data: userProfile.skills.map(skill => skill.proficiency),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome back, {userProfile.name}!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your Profile</h3>
            <p className="text-gray-600">Current Role: {userProfile.currentRole}</p>
            <p className="text-gray-600">Target Role: {userProfile.targetRole}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Skill Overview</h3>
            <div className="h-48">
              <Doughnut data={skillChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Learning Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Completed Courses</h3>
            <ul className="space-y-2">
              {userProfile.learningProgress.completedCourses.map((course, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {course}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">In Progress</h3>
            <ul className="space-y-2">
              {userProfile.learningProgress.inProgressCourses.map((course, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 