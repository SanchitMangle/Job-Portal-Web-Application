import { useEffect } from "react";
import { createContext, useState } from "react";
import { jobsData } from "../assets/assets";

export const AppContext = createContext()
export const AppContexProvider = (props) => {

    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: ''
    })

    const [isSeached, setIsSearched] = useState(false)
    const [jobs, setJobs] = useState([])
    const [showRecruterLogin,setShowRecruterLogin] = useState(false)

    // Function to fetch job data

    const fetchJobs = async () => {
        setJobs(jobsData)
    }

    useEffect(() => {
        fetchJobs()
    }, [])


    const value = {
        searchFilter, setSearchFilter,
        isSeached, setIsSearched, jobs,
        setJobs,showRecruterLogin,
        setShowRecruterLogin
    }

    return (<AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>)
}