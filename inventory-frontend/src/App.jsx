import { useState } from "react";
import { registerUser } from "./api/authApi";

function App() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  return (
    <div>
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
    </div>
  );
}

export default App;