import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/auth/signup", form);
    alert("Signup success");
    nav("/login");
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form
        onSubmit={submit}
        className="bg-white p-8 shadow rounded w-80 space-y-4"
      >
        <h2 className="text-xl font-bold">Signup</h2>

        <input
          className="border p-2 w-full"
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Password"
          type="password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="bg-blue-500 text-white w-full p-2">
          Signup
        </button>
      </form>
    </div>
  );
}