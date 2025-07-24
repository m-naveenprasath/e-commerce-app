import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import { Package, Tag, ShoppingCart, Users } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, categories, orders, users] = await Promise.all([
          api.get("/products/"),
          api.get("/categories/"),
          api.get("/orders/"),
          api.get("/users/"),
        ]);
        setData({
          products: products.data.length,
          categories: categories.data.length,
          orders: orders.data.length,
          users: users.data.length || 0,
        });
      } catch (error) {
        console.error("Dashboard fetch failed", error);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      label: "Products",
      value: data.products,
      icon: <Package className="w-6 h-6 text-blue-600" />,
      to: "/admin/products",
      color: "bg-blue-100",
    },
    {
      label: "Categories",
      value: data.categories,
      icon: <Tag className="w-6 h-6 text-green-600" />,
      to: "/admin/categories",
      color: "bg-green-100",
    },
    {
      label: "Orders",
      value: data.orders,
      icon: <ShoppingCart className="w-6 h-6 text-yellow-600" />,
      to: "/admin/orders",
      color: "bg-yellow-100",
    },
    {
      label: "Users",
      value: data.users,
      icon: <Users className="w-6 h-6 text-purple-600" />,
      to: "/admin/users",
      color: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Link
          key={card.label}
          to={card.to}
          className={`p-6 rounded-xl shadow-sm hover:shadow-md transition ${card.color} flex items-center justify-between`}
        >
          <div>
            <h3 className="text-md font-semibold text-gray-700">{card.label}</h3>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
          <div className="bg-white rounded-full p-2 shadow">{card.icon}</div>
        </Link>
      ))}
    </div>
  );
};

export default Dashboard;

