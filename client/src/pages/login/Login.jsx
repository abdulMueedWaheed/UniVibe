import React, { useContext, useState } from 'react';
import './login.scss';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


const Login = () => {
  const [err, setErr] = useState(null);
  const [userType , setUserType] = useState("Student");

  const [inputs, setInputs] = useState({
    user_name: "", // For Students
    password: "", // for both
    email_address: "",  // for both
  });

  const navigate = useNavigate();

  const handleChange = e => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  }

  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const payload = {...inputs};

      if (userType === "Society") {
        delete payload.user_name;
      }

      console.log("Calling login");
      await login(userType, payload);
      navigate('/');
    }

    catch (error) {
      setErr(error.response.data);
    }
  };

  return (
    <div className='login'>
      <div className="card">
        <div className="left">
          <h1>Uni Vibe.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit, cum
            voluptas? Incidunt iusto ipsum nesciunt repellendus tenetur.
          </p>
          <span>Don't have an account? </span>
          <Link to="/register">
            <button>Register</button>
          </Link>

        </div>
        <div className="right">
          <h1>Login</h1>
          {/* <select name="user_type" id="user_type" value={userType} onChange={handleUserTypeChange}>
            <option value="Student">Student</option>
            <option value="Society">Society</option>
          </select> */}
          <form>
            {userType === "Student" ? (<input type="text" placeholder="Username" name='user_name' onChange={handleChange} />) :
            null}
            <input type="text" placeholder="Email" name='email_address' onChange={handleChange} />
            <input type="password" placeholder="Password" name='password' onChange={handleChange} />
            <button onClick={handleLogin}>Login</button>
          </form>

          {err && <p className="error">{err.message}</p>}
        </div>
      </div>
    </div>
  )
};

export default Login;