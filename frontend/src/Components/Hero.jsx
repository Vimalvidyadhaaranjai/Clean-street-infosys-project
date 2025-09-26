import React from 'react'

const Hero = () => {
    return (
        <div>
            <div className='relative'>
                <img className=' w-screen h-screen ' src="images/hero.png" alt="Hero" />
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <div className=" px-10 mt-20 absolute top-20 hero  ">
                <div className=' flex gap-10 '>
                    <div className='   w-2/3 h-full '>
                        <h1 className=' text-white justify-center text-7xl font-bold'>Transform Your <br />
                            Streets
                        </h1>
                        <p className='mt-4 top-60 left-20 text-white text-2xl'>Join thousands of citizens in building better neighborhoods.
                            Report issues, track progress, and collaborate with local authorities to create the change you want to see. </p>
                    </div>
                    <div className='flex flex-col gap-5 w-1/3 '>
                        <div className="  bg-white/10 backdrop-blur-xl border-white border-1 text-white  p-6 rounded-3xl">
                            <div className='flex gap-2'>
                                <img className='h-6' src="images/icons/icon1.png" alt="" />
                                <h3 className='text-2xl mb-1'>Smart Reporting</h3>
                            </div>
                            <p>Use advance tools to report issues with precise location tracking and photo evidence.</p>
                        </div>
                        <div className="  bg-white/10 backdrop-blur-xl border-white border-1 text-white  p-6 rounded-3xl">
                            <div className='flex gap-2'>
                                <img className=' h-6' src="images/icons/icon2.png" alt="" />
                                <h3 className='text-2xl mb-1'>Role Based Access</h3>
                            </div>
                            <p>Citizens, Volunteers and administrators working together using centralized platform </p>
                        </div>
                        <div className="  bg-white/10 backdrop-blur-xl border-white border-1 text-white  p-6 rounded-3xl">
                            <div className='flex gap-2'>
                                <img className=' h-6' src="images/icons/icon3.png" alt="" />
                                <h3 className='text-2xl mb-1'>Real-Time Updates</h3>
                            </div>
                            <p>Get instant Notifications and track resolution progress in your personalized dashboard.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero