import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Statement() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/account/statement").then((res) => {
      setData(res.data.statement);
    });
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold mb-4">Statement</h2>

      <table className="w-full bg-white shadow">
        <thead>
          <tr className="bg-gray-200">
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Balance After</th>
          </tr>
        </thead>

        <tbody>
          {data.map((t) => (
            <tr
              className={
                t.transaction_type === "credit"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              <td>{new Date(t.created_at).toLocaleString()}</td>
              <td>{t.transaction_type}</td>
              <td>₹{t.amount}</td>
              <td>₹{t.balance_after}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}