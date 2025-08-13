import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Applications from './pages/Applications'
import ApplyJob from './pages/ApplyJob'
import RecruterLogin from './components/RecruterLogin'
import { AppContext } from './context/AppContext'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplication from './pages/ViewApplication'
import Dashboard from './pages/Dashboard'
import 'quill/dist/quill.snow.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {

  const { showRecruterLogin, companyToken } = useContext(AppContext)

  return (
    <div>
      {showRecruterLogin && <RecruterLogin />}
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/applications' element={<Applications />} />
        <Route path='/apply-job/:id' element={<ApplyJob />} />

        <Route path='/dashboard' element={<Dashboard />}>
          {
            companyToken ?
              <>
                <Route path='add-job' element={<AddJob />} />
                <Route path='manage-jobs' element={<ManageJobs />} />
                <Route path='view-applications' element={<ViewApplication />} />
              </>
              : null
          }

        </Route>

      </Routes>
    </div>
  )
}

export default App
