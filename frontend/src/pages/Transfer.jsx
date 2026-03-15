import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Transfer() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    receiver_id: "",
    amount: "",
  });

  useEffect(() => {
    api.get("/account/users").then((res) => {
      setUsers(res.data.users);
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/account/transfer", form);
    alert("Transfer success");
  };

  return (
    <div className="p-10">
      <form className="space-y-4" onSubmit={submit}>
        <h2 className="text-xl font-bold">Send Money</h2>

        <select
          className="border p-2"
          onChange={(e) =>
            setForm({ ...form, receiver_id: e.target.value })
          }
        >
          <option>Select User</option>
          {users.map((u) => (
            <option value={u.id}>{u.name}</option>
          ))}
        </select>

        <input
          className="border p-2"
          placeholder="Amount"
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />

        <button className="bg-green-500 text-white p-2">
          Transfer
        </button>
      </form>
    </div>
  );
}