import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/SignUp.css";

const SignUp = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp ? "http://localhost:5000/api/auth/register" : "http://localhost/api/auth/login";
    const payload = isSignUp
      ? { name, email, password }
      : { email, password, loginMethod: "email" };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log("Raw Response:", text);


      const data = JSON.parse(text);
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (!isSignUp) {
        localStorage.setItem("token", data.token);
        onAuthSuccess(data.user);
        window.location.href = "/dashboard"; // Redirect after login
      } else {
        localStorage.setItem("token", data.token);
        onAuthSuccess(data.user);
        window.location.href = "/dashboard"; // Redirect after sign-up
      }
    } catch (error) {
      console.error("Error:", error)
      alert(error.message);
    }
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }


  return (
    <div className="signup-container">
      <h1>{isSignUp ? "Sign Up" : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type={showPassword ? "password" : "text"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="password-toggle" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
      </form>

      <div className="separator">
        <span>or</span>
      </div>

      <div className="auth-options">
        <button onClick={() => handleOAuthLogin("google")} className="google-auth">
          <FaGoogle /> {isSignUp ? "Sign up" : "Login"} with Google
        </button>
        {isSignUp && (
          <button onClick={() => handleOAuthLogin("github")} className="github-auth">
            <FaGithub /> Sign up with GitHub
          </button>
        )}
      </div>

      <p>
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
        <span onClick={() => setIsSignUp(!isSignUp)} className="toggle-auth">
          {isSignUp ? "Login" : "Sign Up"}
        </span>
      </p>
    </div>
  );
};

export default SignUp;