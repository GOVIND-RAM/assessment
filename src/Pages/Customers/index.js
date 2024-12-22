import { Avatar, Space, Table, Typography, Input } from "antd";
import { useEffect, useState } from "react";
import { getCustomers } from "../../API";

const { Search } = Input;

function Customers() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setLoading(true);
    getCustomers().then((res) => {
      setDataSource(res.users);
      setLoading(false);
    });
  }, []);

  // Filtered data logic
  const filteredData = dataSource.filter((customer) => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    return (
      fullName.includes(searchText.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <Space size={20} direction="vertical" style={{ width: "100%" }}>
      <Typography.Title level={4}>Customers</Typography.Title>

      {/* Search Bar */}
      <Search
        placeholder="Search by name or email"
        onChange={(e) => setSearchText(e.target.value)}
        style={{ maxWidth: 400 }}
      />

      {/* Table */}
      <Table
        loading={loading}
        columns={[
          {
            title: "Photo",
            dataIndex: "image",
            render: (link) => {
              return <Avatar src={link} />;
            },
          },
          {
            title: "First Name",
            dataIndex: "firstName",
          },
          {
            title: "Last Name",
            dataIndex: "lastName",
          },
          {
            title: "Email",
            dataIndex: "email",
          },
          {
            title: "Phone",
            dataIndex: "phone",
          },
          {
            title: "Address",
            dataIndex: "address",
            render: (address) => {
              return (
                <span>
                  {address.address}, {address.city}
                </span>
              );
            },
          },
        ]}
        dataSource={filteredData}
        pagination={{
          pageSize: 5,
        }}
        rowKey={(record) => record.id}
      ></Table>
    </Space>
  );
}

export default Customers;
