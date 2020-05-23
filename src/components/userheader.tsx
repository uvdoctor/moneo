import React, { useEffect, useState } from 'react'
import Logo from './logo'
import { Auth, Hub } from 'aws-amplify'
import { useRouter } from 'next/router'

const UserHeader = () => {
    const [username, setUsername] = useState<string | null>(null)
    const router = useRouter()

    const updateUser = (username: string | null) => {
        if (username) {
            localStorage.setItem("username", username)
            setUsername(username)
        } else {
            localStorage.removeItem("username")
            setUsername(null)
        }
    }

    useEffect(() => {
        const listener = (capsule: any) => {
            let eventType: string = capsule.payload.event
            if (eventType === 'signIn') updateUser(capsule.payload.data.username)
            else if (eventType !== 'configured') updateUser(null)
        }
        Hub.listen('auth', listener)
        let username = localStorage.getItem("username")
        if (username) setUsername(username)
        return () => Hub.remove('auth', listener)
    }, [])

    const handleLogout = async (e: any) => {
        e.preventDefault()
        try {
            await Auth.signOut()
            Hub.dispatch('auth', {event: 'signOut'} )
        } catch (error) {
            console.log('error signing out: ', error)
        } finally {
            router.reload()
        }
    }

    const handleHelp = () => { }

    return (
        <nav className="md:text-lg lg:text-xl fixed flex w-full bg-white items-center justify-between flex-wrap py-1 top-0 animated items-center cursor font-bold">
            <Logo />
            {username ?
                <div className="flex">
                    <div className="ml-8 md:ml-12 hoverable relative inline-block hover:text-green-600"><label>{username}</label>
                        <ul className="px-2 md:px-4 py-1 dropdown-menu absolute shadow-xl bg-green-600 text-white font-normal text-base md:text-lg">
                            <li className="py-1 hover:text-black">Profile</li>
                            <li className="py-1 hover:text-black">Settings</li>
                            <li className="py-1 hover:text-black" onClick={handleLogout}>Logout</li>
                        </ul>
                    </div>
                    <div className="ml-8 md:ml-12 mr-2" onClick={handleHelp}><a>Help</a></div>
                </div>
                : <div className="mr-2 md:mr-4 text-xl md:text-2xl font-black text-green-600">DollarDarwin</div>
            }
        </nav>
    );
}

export default UserHeader
