import { useState } from "react";
import AxiosService from "../../redux/helpers/interceptor";
import "./login.scss";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../../assets/kasfolio_transparent.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // useEffect(() => {
  //   console.log(window.location.origin);
  // }, [])

  const handleLogin = async () => {
    try {
      const res = await AxiosService.post("/auth/login", {
        email,
        password,
      });

      if (res && res.token) {
        setError("");
        localStorage.setItem("token", res.token);
        setSuccess("Login successful ✅");
        navigate("/dashboard");
      } else {
        setSuccess("");
        setError("Invalid username/password ❌");
      }
    } catch (err) {
      setSuccess("");
      const message =
        // err?.response?.data?.message +
        err?.response?.data +
        err?.message;
      setError(message);
      console.error("** ", err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("google ", process.env.REACT_APP_API_BASE);
    try {
      const idToken = credentialResponse.credential; // Google ID token
      const res = await AxiosService.post(`${process.env.REACT_APP_API_BASE}/auth/google`, { idToken });
      console.log("res ", res);
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (e) {
      alert(e.response?.data || e.message);
    }
  };

  const handleGoogleError = () => {
    alert("Google Login Failed");
  };

  return (
    <div className="login-wrapper split-layout">
      <div className="left-side">
        <div className="brand">
          <img src={logo} alt="Kasfolio" />
          <h1>Kasfolio</h1>
        </div>
        <p className="company-desc">
          Track your cryptocurrency portfolio in real-time,
          get market insights, and manage your assets effortlessly.
        </p>
      </div>
      <div className="vertical-divider"></div>
      <div className="login-card">
        <h2>Welcome Back 👋</h2>
        <p>Login to track your portfolio</p>

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <span className="error-msg">{error}</span>}
        {success && <span className="success-msg">{success}</span>}

        <button onClick={handleLogin}>Sign In</button>

        <span className="divider">OR</span>
        <div className="wrapper-google">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          >Continue with Google</GoogleLogin>
        </div>
        <div className="bottom-text">
          Don’t have an account? <b onClick={() => navigate("/register")}>Sign up</b>
        </div>
      </div>
    </div>
  );
};

export default Login;
