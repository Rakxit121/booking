import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../userContext/UserContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const emailIsValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailRegex.test(email);
  };
  const isFormValid = emailIsValid(email) && password;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!isFormValid) {
        toast.error("Please enter a valid Gmail address and password.");
        return;
      }

      const res = await axios.post(
        `/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/");
        setUser(res.data.user);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const enabledButtonClass = isFormValid ? "primary" : "disabled";

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLogin}>
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
            Login
          </button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{" "}
            <Link className="underline text-black" to="/register">
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
