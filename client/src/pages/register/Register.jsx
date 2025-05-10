import React from 'react'
import './register.scss'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import axios from "axios"

const Register = () => {
    const [err, setErr] = useState(false);

    const [input, setInput] = useState({
        user_name: "", // Updated to match the backend key
        password: "",
        email_address: "",
        full_name: ""
    });

    const handleChange = e => {
        setInput((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/auth/register", input);
            console.log("User registered successfully");
        } catch (error) {
            setErr(true);
            console.error("Error during registration:", error);
        }
    };

    return (
        <div className='register'>
            <div className="card">
                <div className="left">
                    <h1>Register</h1>
                    <form>
                        <input type="text" placeholder="Name" name='full_name' onChange={handleChange} />
                        <input type="text" placeholder="Username" name='user_name' onChange={handleChange} /> {/* Updated name */}
                        <input type="email" placeholder="Email" name='email_address' onChange={handleChange} />
                        <input type="password" placeholder="Password" name='password' onChange={handleChange} />
                        <button onClick={handleClick}>Register</button>
                    </form>
                </div>

                <div className="right">
                    <h1>Uni Vibe.</h1>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit, cum
                        voluptas? Incidunt iusto ipsum nesciunt repellendus tenetur.
                    </p>
                    <span>Already have an account? </span>
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Register;