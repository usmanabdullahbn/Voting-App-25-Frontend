import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = ({ login, showNotification }) => {
  const nativate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error("Registration Failed");

      const { token, user } = await response.json();

      login(token, user);
      showNotification("Registration successfully", "success");
      nativate("/");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
