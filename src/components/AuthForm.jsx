import React, { useState } from 'react';
import { supabase } from '../clients/SupaBaseClient';
import { useNavigate } from 'react-router-dom';


const AuthForm = ( {setUser} ) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const navigator = useNavigate();

  // SingIn or Singup
  const handleAuth = async (e) => {
    e.preventDefault();
    let result;
    if (isLogin) {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ 
        email, 
        password, 
        options: {
          data: {
            display_name: username,
          },
        },
      });
    }

    if (result.error) {
      setMessage(result.error.message);
    } else if (result.data.user){
      setUser(result.data.user);
      navigator("/");
    } else {
      setMessage(isLogin ? 'Logged in!' : 'Signed up! Check your email to confirm.');
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={handleAuth}>
        {isLogin ? <></> : <input
          type="text"
          className="form-control my-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />}
        <input
          type="email"
          className="form-control my-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control my-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100" type="submit">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
          </button>
        </div>
        {message && <p className="text-danger text-center mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default AuthForm;
