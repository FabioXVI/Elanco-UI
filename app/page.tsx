import "./home.css";
import NavBar from "./navbar/page";
import Image from "next/image"
import Button from '@mui/joy/Button';
import Footer from "./footer/page";
import { Link } from "@mui/material";

export default function Home() {
  return (
    <main>
        <div>
          <NavBar/>
        </div>
        <div className="info-container">
          <h1>Welcome</h1>
          <h4>Welcome to Elanco's Animal Insights Portal! Here, we empower you with the knowledge to better understand and care for your beloved animals. Our platform utilizes advanced data analytics to provide you with comprehensive statistics about your pets or livestock. Through visually engaging graphs and informative text, we offer insights into various aspects of your animals' health and behavior. Whether you're a pet owner looking to monitor your furry friend's activity levels or a farmer seeking to optimize your herd's performance, our website is your go-to destination for meaningful data representation. Explore the fascinating world of animal insights with us and make informed decisions for the well-being of your cherished companions.</h4>
          <br/>
        </div>
        <br/>
        <div className="image-line">
          <div className ="image-aligner">
            <Image src="/images/dog1.webp" alt="dog1" width={294.4} height={196.4}/>
          </div>
          <div className ="image-aligner">
            <Image src="/images/dog2.webp" alt="dog2" width={294.4} height={196.4}/>
          </div>
          <div className ="image-aligner">
          <Image src="/images/dog3.webp" alt="dog3" width={294.4} height={196.4}/>
          </div>
        </div>
        <br />
        <div className="login-container">
          <h3>Login or Sign Up now to find out more!</h3>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <Button className="button">Login</Button>
          </Link>
          
          <Link href="/register" style={{ textDecoration: 'none' }}>
            <Button className="button">Sign Up</Button>
          </Link>
        </div>
        <br/>
        <div>
          <Footer/>
        </div>
    </main>
  );
}
