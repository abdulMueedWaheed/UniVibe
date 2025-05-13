import React from 'react'
import './register.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from "axios"

const Register = () => {
    const [err, setErr] = useState(null);
    const navigate = useNavigate();

    const [userType, setUserType] = useState("Student");

    const [inputs, setInputs] = useState({
        user_name: "", // For students
        password: "",
        email_address: "",
        full_name: "",
        description: "" // For societies
    });

    const handleChange = e => {
        setInputs((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    };

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            // Create payload based on user type
            const payload = { ...inputs };

            // Add user type to the payload
            payload.user_type = userType;

            // If it's a society, we don't need username
            if (userType === "Society") {
                delete payload.user_name;
            } else {
                // If it's a student, we don't need description
                delete payload.description;
            }

            await axios.post("http://localhost:5000/api/auth/register", payload);
            console.log("User registered successfully");
            //navigate to login
            navigate("/login");
        } catch (error) {
            setErr(error.response.data);
            console.error("Error during registration:", error);
        }
    };

    return (
        <div className='register'>
            <div className="card">
                <div className="left">
                    <h1>Register</h1>
                    <select
                        name="user_type"
                        id="user_type"
                        value={userType}
                        onChange={handleUserTypeChange}
                    >
                        <option value="Student">Student</option>
                        <option value="Society">Society</option>
                    </select>
                    <form>
                        <input
                            type="text"
                            placeholder="Name"
                            name='full_name'
                            onChange={handleChange}
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            name='email_address'
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name='password'
                            onChange={handleChange}
                        />

                        {userType === "Student" ? (
                            <input
                                type="text"
                                placeholder="Username"
                                name='user_name'
                                onChange={handleChange}
                            />
                        ) : (
                            <textarea
                                placeholder="Society Description"
                                name='description'
                                onChange={handleChange}
                                rows="3"
                            />
                        )}


                        <button onClick={handleClick}>Register</button>
                    </form>

                    {/* Display error message */}
                    {err && <p className="error">{err.message}</p>}
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