import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const emailIsValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailRegex.test(email);
  };
  const isFormValid = name && emailIsValid(email) && password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/auth/register`, {
        name,
        email,
        password,
      });

      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const enabledButtonClass = isFormValid ? "primary" : "disabled";
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className={enabledButtonClass}
            type="submit"
            disabled={!isFormValid}
          >
            Submit
          </button>
          <div className="text-center py-2 text-gray-500">
            Already a memeber?{" "}
            <Link className="underline text-black" to="/login">
              Login now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
