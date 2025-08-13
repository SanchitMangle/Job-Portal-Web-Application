import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const RecruterLogin = () => {

    const navigate = useNavigate()
    const [state, setState] = useState('Login')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const [image, setImage] = useState(false)
    const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false)

    const { setShowRecruterLogin, backendUrl, setCompanyToken, setCompanyData } = useContext(AppContext)

    const onSubmitHander = async (e) => {
        e.preventDefault()
        if (state === 'Sing Up' && !isTextDataSubmitted) {
           return setIsTextDataSubmitted(true)
        }

        try {

            if (state === 'Login') {
                const { data } = await axios.post(backendUrl + '/api/company/login', { email, password })
                if (data.success) {
                    // console.log(data);
                    setCompanyData(data.company)
                    setCompanyToken(data.token)
                    localStorage.setItem('companyToken', data.token)
                    setShowRecruterLogin(false)
                    navigate('/dashboard')
                }
                else {
                    toast.error(data.message)
                }
            }
            else {
                const formData = new FormData()
                formData.append('name', name)
                formData.append('email', email)
                formData.append('password', password)
                formData.append('image', image)

                const { data } = await axios.post(backendUrl + '/api/company/register', formData)
                if (data.success) {
                    // console.log(data);
                    setCompanyData(data.company)
                    setCompanyToken(data.token)
                    localStorage.setItem('companyToken', data.token)
                    setShowRecruterLogin(false)
                    navigate('/dashboard')
                }
                else{
                    toast.error(data.message)
                }

            }

        } catch (error) {
           console.log(error);
           toast.error(error.message)
        }
    }

    // To stop scroll 

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    })

    return (
        <div className='absolute top-0 bottom-0 right-0 left-0 z-10 backdrop-blur-sm bg-black/30   flex justify-center items-center'>
            <form onSubmit={onSubmitHander} className='relative bg-white p-10 rounded-xl text-slate-500'>
                <h2 className='text-center text-2xl text-neutral-700 font-medium'>Recruter {state}</h2>
                <p className='text-sm '>Welcome back! Please sign in to continue</p>
                {state === 'Sing Up' && isTextDataSubmitted
                    ? <>
                        <div className='flex items-center gap-4 my-10'>
                            <label htmlFor="image">
                                <img className='w-16 rounded-full' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                                <input onChange={e => setImage(e.target.files[0])} type="file" id='image' hidden />
                            </label>
                            <p>Upload company <br />logo</p>
                        </div>
                    </>
                    : <>
                        {state !== 'Login' && (
                            <div className='border px-4 py-2 flex items-center rounded-full gap-2 mt-5'>
                                <img src={assets.person_icon} alt="" srcset="" />
                                <input className='outline-none text-sm' onChange={e => setName(e.target.value)} value={name} type="text" placeholder='Company Name' required />
                            </div>
                        )}

                        <div className='border px-4 py-2 flex items-center rounded-full gap-2 mt-5'>
                            <img src={assets.email_icon} alt="" srcset="" />
                            <input className='outline-none text-sm' onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder='Email Id' required />
                        </div>
                        <div className='border px-4 py-2 flex items-center rounded-full gap-2 mt-5'>
                            <img src={assets.lock_icon} alt="" srcset="" />
                            <input className='outline-none text-sm' onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder=' Password' required />
                        </div>

                    </>
                }
                {state === "Login" && <p className='text-sm my-4 text-blue-600 cursor-pointer'>Forgot Password?</p>
                }
                <button type='submit' className='bg-blue-600 text-white py-2 w-full rounded-full mt-4 '>{state === 'Login' ? 'login' : isTextDataSubmitted ? 'create account' : 'Next'}</button>

                {
                    state === "Login"
                        ? <p className='mt-5 text-center'>Don't have an account? <samp className='text-blue-600 cursor-pointer' onClick={() => setState('Sing Up')}>Sign up</samp></p>
                        : <p className='mt-5 text-center'>Already have an account? <samp className='text-blue-600 cursor-pointer' onClick={() => setState('Login')}>Login</samp></p>
                }

                <img onClick={() => setShowRecruterLogin(false)} className='absolute top-5 right-5 cursor-pointer' src={assets.cross_icon} alt="" />

            </form>
        </div>
    )
}

export default RecruterLogin
