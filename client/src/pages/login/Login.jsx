import React from 'react'
import './login.scss'   
import {Link} from 'react-router-dom' 
const Login = () => {
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
            <input type="text" placeholder="Username" name="" id="" />
            <input type="password" placeholder="Password" />
            <button>Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login