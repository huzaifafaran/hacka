import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import SkillAnalysis from './pages/SkillAnalysis'
import LearningPath from './pages/LearningPath'
import JobMatches from './pages/JobMatches'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/skill-analysis" element={<SkillAnalysis />} />
          <Route path="/learning-path" element={<LearningPath />} />
          <Route path="/job-matches" element={<JobMatches />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App 