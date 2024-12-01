import React, { useEffect, useState } from 'react';
import { DollarCircleOutlined, ShoppingCartOutlined, ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Space, Statistic, Typography, Modal } from "antd";
import { Bar, } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { getCustomers, getInventory, getOrders, getRevenue } from "../../API";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
ChartJS.register(
  ArcElement,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend
);

function Dashboard() {
  const [orders, setOrders] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);

  useEffect(() => {
    getOrders().then((res) => {
      setOrders(Math.round(res.total));
      setRevenue(res.discountedTotal);
    });
    getInventory().then((res) => {
      setInventory(res.total);
    });
    getCustomers().then((res) => {
      setCustomers(res.total);
    });

    getRevenue().then(() => {
      const monthlyRevenue = [
        { month: 'Jan', revenue: 15000 },
        { month: 'Feb', revenue: 18000 },
        { month: 'Mar', revenue: 22000 },
        { month: 'Apr', revenue: 20000 },
        { month: 'May', revenue: 25000 },
        { month: 'Jun', revenue: 30000 },
      ];

      setMonthlyData({
        labels: monthlyRevenue.map(item => item.month),
        datasets: [
          {
            label: 'Monthly Revenue',
            data: monthlyRevenue.map(item => item.revenue),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    });
  }, []);

  const handleOrdersDrillDown = () => {
    getOrders().then((res) => {
      const tableData = res.products.slice(0, 5);

      setModalContent(
        <TableContainer component={Paper} style={{ maxHeight: '600px', maxWidth: '800px' }}>
          <Table sx={{ minWidth: 100 }} aria-label="order details">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price&nbsp;($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.title}>
                  <TableCell>{row.title}</TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell align="right">{Math.round(row.discountedTotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
      setIsModalVisible(true);
    });
  };

  const handleRevenueDrillDown = () => {
    getRevenue().then((res) => {
      const maxUsers = 5;
      const colors = [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
        "#FF9F40", "#66B3FF", "#FFB3E6", "#4B8E8D", "#FF4C4C"
      ];
  
      const topUsers = res.carts.slice(0, maxUsers);
      const data = topUsers.map((cart, index) => ({
        value: Math.round(cart.discountedTotal),
        label: `User ${cart.userId}`,
        backgroundColor: colors[index % maxUsers],
      }));
  
      setModalContent(
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <PieChart series={[{ data, innerRadius: 80 }]} width={500} height={300}>
          </PieChart>
        </div>
      );
      setIsModalVisible(true);
    });
  };
  
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Revenue Overview',
      },
    },
  };

  return (
    <Space size={20} direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={4}>Dashboard</Typography.Title>
      <Space direction="horizontal">
        <DashboardCard
          icon={
            <ShoppingCartOutlined
              style={{
                color: "green",
                backgroundColor: "rgba(0,255,0,0.25)",
                borderRadius: 40,
                fontSize: 24,
                padding: 20,
              }}
            />
          }
          title="Orders Worth"
          value={`$${orders}`}
          onClick={handleOrdersDrillDown}
        />
        <DashboardCard
          icon={
            <ShoppingOutlined
              style={{
                color: "blue",
                backgroundColor: "rgba(0,0,255,0.25)",
                borderRadius: 40,
                fontSize: 24,
                padding: 20,
              }}
            />
          }
          title="Inventory"
          value={`${inventory} units`}
        />
        <DashboardCard
          icon={
            <UserOutlined
              style={{
                color: "purple",
                backgroundColor: "rgba(0,255,255,0.25)",
                borderRadius: 40,
                fontSize: 24,
                padding: 20,
              }}
            />
          }
          title="Customers"
          value={`${customers} users`}
        />
        <DashboardCard
          icon={
            <DollarCircleOutlined
              style={{
                color: "red",
                backgroundColor: "rgba(255,0,0,0.25)",
                borderRadius: 40,
                fontSize: 24,
                padding: 20,
              }}
            />
          }
          title="Revenue Generated"
          value={`$${Math.round(revenue)}`}
          onClick={handleRevenueDrillDown}
        />
      </Space>

      {monthlyData && (
        <Card>
          <div style={{ width: '50%', height: '300px' }}>
            <Bar options={barOptions} data={monthlyData} />
          </div>
        </Card>
      )}

      <Modal
        title="Detailed Information"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {modalContent}
      </Modal>
    </Space>
  );
}

function DashboardCard({ title, value, icon, onClick }) {
  return (
    <Card onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <Space direction="horizontal" align="center">
        {icon}
        <Space direction="vertical" size={0}>
          <Statistic
            title={
              <div>
                {title} {onClick && <span style={{ fontSize: "12px" }}>▼</span>}
              </div>
            }
            value={typeof value === 'number' ? Math.round(value) : value}
          />
        </Space>
      </Space>
    </Card>
  );
}

export default Dashboard;
