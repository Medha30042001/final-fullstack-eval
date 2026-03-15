import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    api.get("/account/balance").then((res) => {
      setBalance(res.data.balance);
    });
  }, []);

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="bg-white p-6 shadow rounded">
        Balance: ₹{balance}
      </div>

      <div className="space-x-4">
        <Link className="bg-blue-500 text-white p-2" to="/transfer">
          Send Money
        </Link>

        <Link className="bg-purple-500 text-white p-2" to="/statement">
          Statement
        </Link>
      </div>
    </div>
  );
}