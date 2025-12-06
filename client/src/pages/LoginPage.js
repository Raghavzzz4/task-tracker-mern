import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  try {
    const api = mode === "login" ? loginUser : registerUser;
    const res = await api({ email, password });

    if (mode === "login") {
      // normal login flow
      login(res.data.user, res.data.token);
      navigate("/");
    } else {
      // register: only show success + reset fields, stay on form
      setSuccess("Registration successful! You can now log in.");
      setPassword("");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong");
  }
};

  return (
    <div className="auth-container">
      <h2>{mode === "login" ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">
          {mode === "login" ? "Login" : "Create account"}
        </button>
      </form>
      <button
        className="link-btn"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login"
          ? "New here? Register"
          : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default LoginPage;
