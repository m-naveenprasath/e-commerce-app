import { useEffect, useState } from "react";
import api from "../../../services/api";

const UserList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api
      .get("/users/")
      .then((res) => {
        const onlyCustomers = res.data.filter((user) => user.is_customer);
        setCustomers(onlyCustomers);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="p-6 px-4 sm:px-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">👤 All Customers</h2>

      {customers.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-10">
          No customers found.
        </div>
      ) : (
        <div className="space-y-6">
          {customers.map((user) => (
            <div
              key={user.id}
              className="bg-white border shadow-md rounded-2xl p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="text-gray-700 font-medium">
                  <span className="font-semibold">User ID:</span> #{user.id}
                </div>
              </div>

              <div className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">Email:</span> {user.email}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
