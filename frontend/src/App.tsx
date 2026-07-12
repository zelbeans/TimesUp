import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Dashboard } from '@/pages/Dashboard'
import { Tasks } from '@/pages/Tasks'
import { Habits } from '@/pages/Habits'
import { Events } from '@/pages/Events'
import { Analytics } from '@/pages/Analytics'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="habits" element={<Habits />} />
        <Route path="events" element={<Events />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  )
}

export default App
