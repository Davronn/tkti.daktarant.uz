import React, { useState } from "react";
// import { auth } from "../firebaseConfig"; // Agar Firebase Authentication ishlatayotgan bo'lsangiz
// import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Muvaffaqiyatli kirishdan keyin sahifani o'zgartirish
    } catch (err) {
      setError("Email yoki parol noto‘g‘ri!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Emailingizni kiriting"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Parolni kiriting"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Kirish</button>
        </form>
        <p>
          Hisobingiz yo‘qmi? <a href="/register">Ro‘yxatdan o‘tish</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
