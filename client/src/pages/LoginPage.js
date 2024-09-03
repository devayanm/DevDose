import React from 'react';
import LoginForm from '../components/LoginForm';

function LoginPage() {
  const handleLogin = (loginData) => {
    // Handle login via API
  };

  return (
    <div>
      <h1>Login</h1>
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}

export default LoginPage;
