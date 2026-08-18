import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth, ROLES } from "../context/AuthContext";

function Login() {
    //HOOKS & CONTEXT
    const { login, user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    //USE STATE 
    const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
});
    const [loginResult, setLoginResult] = useState("");

    //USE EFFECT
    useEffect(() => {
        if (isAuthenticated) {
            navigate(user.role === ROLES.ADMIN ? "/admin" : "/dashboard");
        }
        }, [isAuthenticated, user, navigate]);

    //HANDLERS
    const handleLoginChange = (e) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginResult("Sending...");

    try {
        const data = await loginUser(loginForm.email, loginForm.password);
        console.log("Login response:", data);

        login(data.token, data.user);
        
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