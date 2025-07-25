import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import {
  Package,
  Tag,
  ShoppingCart,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Dashboard = () => {
  const [data, setData] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
  });

  const [orderStats, setOrderStats] = useState([]);
  const [hourlyOrders, setHourlyOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, categories, orders, users] = await Promise.all([
          api.get("/products/"),
          api.get("/categories/"),
          api.get("/orders/"),
          api.get("/users/"),
        ]);

        const productsData = products.data;
        const categoriesData = categories.data;
        const ordersData = orders.data;
        const usersData = users.data;

        setData({
          products: productsData.length,
          categories: categoriesData.length,
          orders: ordersData.length,
          users: usersData.filter((user) => user.is_customer).length || 0,
        });

        // Orders grouped by date
        const orderCountMap = {};
        const hourMap = {};

        ordersData.forEach((order) => {
          const date = order.created_at.slice(0, 10);
          const hour = new Date(order.created_at).getHours();

          orderCountMap[date] = (orderCountMap[date] || 0) + 1;
          hourMap[hour] = (hourMap[hour] || 0) + 1;
        });

        const orderChartData = Object.entries(orderCountMap).map(
          ([date, count]) => ({ date, count })
        );
        setOrderStats(orderChartData);

        const hourlyData = Array.from({ length: 24 }, (_, h) => ({
          hour: `${h}:00`,
          count: hourMap[h] || 0,
        }));
        setHourlyOrders(hourlyData);
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
      label: "Customers",
      value: data.users,
      icon: <Users className="w-6 h-6 text-purple-600" />,
      to: "/admin/users",
      color: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-10">
      {/* 📦 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className={`p-6 rounded-xl shadow-sm hover:shadow-md transition ${card.color} flex items-center justify-between`}
          >
            <div>
              <h3 className="text-md font-semibold text-gray-700">
                {card.label}
              </h3>
              <p className="text-3xl font-bold">{card.value}</p>
            </div>
            <div className="bg-white rounded-full p-2 shadow">{card.icon}</div>
          </Link>
        ))}
      </div>

      {/* 📊 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            📈 Orders by Date
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Hour */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            🕒 Hourly Orders
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyOrders}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
