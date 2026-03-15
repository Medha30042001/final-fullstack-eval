import { useContext, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.post("/auth/login", form);
    login(res.data);
    nav("/");
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form
        onSubmit={submit}
        className="flex flex-column"
      >
        <h2 className="text-xl font-bold">Login</h2>

        <input
          className="border p-2 w-full"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button type="submit" className="bg-green-500 text-white w-full p-2">
          Login
        </button>
      </form>
    </div>
  );
}