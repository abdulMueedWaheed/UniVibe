import React, { useContext , useState} from 'react';
import './login.scss';
import {Link, useNavigate} from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


const Login = () => {
  const [err, setErr] = useState(null);

  const [inputs, setInputs] = useState({
      user_name: "", // Updated to match the backend key
      password: "",
      email_address: ""
  });

  const navigate = useNavigate();

  const handleChange = e => {
      setInputs((prev) => ({
          ...prev,
          [e.target.name]: e.target.value
      }))
  };

  const {login} = useContext(AuthContext);

  const handleLogin = async(e) => {
    e.preventDefault();
    try {
      await login(inputs);
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
          <form>
            <input type="text" placeholder="Username" name='user_name' onChange={handleChange}/>
            <input type="password" placeholder="Password" name='password' onChange={handleChange}/>
            <input type="text" placeholder="Email" name='email_address' onChange={handleChange}/>
            <button onClick={handleLogin}>Login</button>
          </form>

          {err && <p className="error">{err.message}</p>}
        </div>
      </div>
    </div>
  )
};

export default Login;