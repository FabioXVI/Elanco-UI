"use client";
import "./login.css";
import NavBar from "../navbar/page";
import Footer from "../footer/page";
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { Link } from "@mui/material";

export default function Login() {

  return (
    <main>
        <div>
          <NavBar/>
          <form>
          <div className="login-form">
            <div className="login-container">
              <h1>Login to your account</h1>
              <h2>______________________________________</h2>
              <br></br>
              <div className="input-container">
                <Input style={{width: "50%"}} placeholder="Email"/>
              </div>
              <br />
              <br />
              <div className="input-container">
                <Input style={{width: "50%"}} type="password" placeholder="Password"/>
              </div>
              <br />
              <br />
              <div>
              <Link href="/main?dog=canineone&date=08-01-2021" style={{ textDecoration: 'none' }}>
                  <Button style={{width:"15%"}}>Login</Button>
                </Link>
              </div>
            </div>
          </div>
        </form>
        <form>
          <div className="login-container2">
            <h1>New here?</h1>
            <h3>Please create your account by clicking sign up below</h3>
            <br></br>
            <div id="button">
              <Button style={{width:"15%"}}>Sign up</Button>
            </div>
          </div>
        </form>
      </div>
      <div>
        <Footer/>
      </div>
    </main>
  );
}
