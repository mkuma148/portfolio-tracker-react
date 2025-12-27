import { useState } from "react";
import AxiosService from "../../redux/helpers/interceptor";
import "./registration.scss";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match ❌");
      return;
    }

    try {
      const res = await AxiosService.post("/auth/register", {
        firstName,
        lastName,
        password,
        email,
      });
      console.log("res ", res);
      if (res && res?.token) {
        localStorage.setItem("token", res.token);
        setError("");
        setSuccess("Registration successful ✅");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setSuccess("");
        setError("Registration failed ❌");
      }
    } catch (err) {
      setSuccess("");
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message;
      setError(message);
      console.error(err);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>Create Account 🚀</h2>
        <p>Start tracking your portfolio today</p>

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          type="email"
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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <span className="error">{error}</span>}
        {success && <span className="success">{success}</span>}

        <button onClick={handleRegister}>Sign Up</button>

        <span className="divider">OR</span>

        <button className="google-btn">Sign up with Google</button>

        <div className="bottom-text">
          Already have an account?{" "}
          <b onClick={() => navigate("/login")}>Login</b>
        </div>
      </div>
    </div>
  );
};

export default Registration;
