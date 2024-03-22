
"use client"; // This is a client component 👈🏽

import "./navbar.css"
import Image from "next/image"
import { Link } from "@mui/material"
export default function Nav(){
    const currentUrl = window.location.href;
    const urlObj = new URL(currentUrl);
    let dogNum = urlObj.searchParams.get('dog')
    const link = `/main?dog=${dogNum}&date=08-01-2021`;
    return (
        <div  className="container">
            <div className="link-container" id="navbar">
                <Link href = {link.toString()}>
                    <Image className="elanco-logo" src="/images/cropfblogo.jpg" alt="Logo" width={150} height={50}/>
                </Link>
                <Link className="redirect" href='/'><p>Home</p></Link>
                <Link className="redirect" href='/login'><p>Login</p></Link>
                <Link className="redirect" href='/register'><p>Sign Up</p></Link>
                <Link className="redirect" href='/about'><p>About</p></Link>
            </div>
        </div>
    )
}