import React, { useContext, useEffect } from 'react'
import { assets, viewApplicationsPageData } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const ViewApplication = () => {

  const { backendUrl, companyToken } = useContext(AppContext)

  const [applicants, setapplicants] = useState(false)

  // Function to fetch company job application data
  const fetchCompanyJobApplications = async () => {

    try {

      const { data } = await axios.get(backendUrl + '/api/company/applicants', { headers: { token: companyToken } })

      if (data.success) {
        setapplicants(data.applications.reverse())
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }

  }

  // change application status
  const changeJobApplicationStatus = async (id, status) => {

    try {

      const { data } = await axios.post(backendUrl + '/api/company/change-status', { id, status },
        { headers: { token: companyToken } }
      )

      if (data.success) {
        fetchCompanyJobApplications()
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications()
    }
  }, [companyToken])

  return applicants ? applicants.length === 0 ? (
    <div className='flex items-center justify-center h-[70vh]'>
      <p className='text-xl sm:text-2xl'>No Applications Available</p>
    </div>
  ) : (
    <div className='container mx-auto p-4'>
      <div>
        <table className='w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm'>
          <thead>
            <tr className='border-b'>
              <th className='py-2 px-4 text-left'>#</th>
              <th className='py-2 px-4 text-left'>User name</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 text-left'>Resume</th>
              <th className='py-2 px-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.filter(item => item.jobId && item.userId).map((applicant, index) => (
              <tr key={index} className='text-gray-700'>
                <td className='py-2 px-4 border-b text-center'>{index + 1}</td>
                <td className='py-2 px-4 border-b text-center flex items-center'>
                  <img className='w-8 h-8 rounded-full mr-3 max-sm:hidden' src={applicant.userId.image} alt="" />
                  <span>{applicant.userId.name}</span>
                </td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{applicant.jobId.title}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{applicant.jobId.location}</td>
                <td className='py-2 px-4 border-b'>
                  <a className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center' href={applicant.userId.resume} target='_blank'>
                    Resume <img src={assets.resume_download_icon} alt="" />
                  </a>
                </td>
                <td className='py-2 px-4 border-b relative'>
                  {applicant.status === "Pending"
                    ? <div className='relative inline-block text-left group'>
                      <button className='text-gray-500 action-button'>...</button>
                      <div className='z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block '>
                        <button onClick={() => changeJobApplicationStatus(applicant._id, 'Accepted')} className='block w-full text-left py-4 px-2 hover:bg-gray-100 text-blue-500'>Accept</button>
                        <button onClick={() => changeJobApplicationStatus(applicant._id, 'Rejected')} className='block w-full text-left py-4 px-2 hover:bg-gray-100 text-red-500'>Reject</button>
                      </div>
                    </div>
                    : <div>{applicant.status}</div>
                  }

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : <Loading />
}

export default ViewApplication
