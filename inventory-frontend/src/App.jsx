import { useState } from "react";
import { registerUser, loginUser } from "./api/authApi";


function App() {

  ////////////////////////////
  // register user use state
  ////////////////////////////
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [result, setResult] = useState("");

  ////////////////////////////
  // login user use state
  ////////////////////////////
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loginResult, setLoginResult] = useState("");

  ////////////////////////////
  // handle change register
  ////////////////////////////
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  ////////////////////////////
  // handle change login
  ////////////////////////////
  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  ////////////////////////////
  // handle submit register
  ////////////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("Sending...");

try {
      const data = await registerUser(form);

      setResult(JSON.stringify(data, null, 2));

    } catch (err) {
      setResult("Error: " + err.message);
    }
  };

  ////////////////////////////
  // handle submit login
  ////////////////////////////
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginResult("Sending...");

    try {
      const data = await loginUser(loginForm.email, loginForm.password);

      setLoginResult(JSON.stringify(data, null, 2));

    } catch (err) {
      setLoginResult("Error: " + err.message);
    }
  };

  return (
    <div>
      {/* new: register form */}
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="first_name"
          placeholder="First name"
          value={form.first_name}
          onChange={handleChange}
        />
        <br />
        <input
          name="last_name"
          placeholder="Last name"
          value={form.last_name}
          onChange={handleChange}
        />
        <br />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Register</button>
      </form>

      <pre>{result}</pre>

      <hr />

      {/* new: login form, same structure as register */}
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


    </div>
  );
}

export default App;