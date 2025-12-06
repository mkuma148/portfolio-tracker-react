import { useState } from "react";
import AxiosService from "../../redux/helpers/interceptor";
import "./login.scss";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    try {
      const res = await AxiosService.post("/users/login", null, {
        username,
        password,
      });

      if (res === "Login successful") {
        setError("");
        setSuccess("Login successful ✅");
        navigate("/home");
      } else {
        setSuccess("");
        setError("Invalid username/password ❌");
      }
    } catch (err) {
      setSuccess("");
      setError("Server error ❌", err);
      console.error(err);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Welcome Back 👋</h2>
        <p>Login to track your portfolio</p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <span style={{ color: "red" }}>{error}</span>}
        {success && <span style={{ color: "green" }}>{success}</span>}

        <button onClick={handleLogin}>Sign In</button>

        <span className="divider">OR</span>

        <button className="google-btn">Continue with Google</button>

        <div className="bottom-text">
          Don’t have an account? <b>Sign up</b>
        </div>
      </div>
    </div>
  );
};

export default Login;
