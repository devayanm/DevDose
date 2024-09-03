import React from 'react';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  const handleRegister = (registerData) => {
    // Handle registration via API
  };

  return (
    <div>
      <h1>Register</h1>
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
}

export default RegisterPage;
