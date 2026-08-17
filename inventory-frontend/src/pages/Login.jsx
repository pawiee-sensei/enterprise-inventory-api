import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function Login() {
    const { login } = useAuth();

    const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
});
    const [loginResult, setLoginResult] = useState("");

    const handleLoginChange = (e) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginResult("Sending...");

    try {
        const data = await loginUser(loginForm.email, loginForm.password);

        login(data.token, data.user);

        setLoginResult(JSON.stringify(data, null, 2));
        
    } catch (err) {
        setLoginResult("Error: " + err.message);
    }
};

return (
    <div>
        <h1>Login</h1>
        <form onSubmit={handleLoginSubmit}>
        <input
            name="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={handleLoginChange}
        />
        <br />
        <input
            name="password"
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={handleLoginChange}
        />
        <br />
        <button type="submit">Login</button>
    </form>

        <pre>{loginResult}</pre>

              <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>

);
}

export default Login;