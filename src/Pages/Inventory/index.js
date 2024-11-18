import { Avatar, Rate, Space, Table, Typography, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { getInventory } from "../../API";

const { Search } = Input;
const { Option } = Select;

function Inventory() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    getInventory().then((res) => {
      setDataSource(res.products);
      setLoading(false);
    });
  }, []);

  // Filtered data logic
  const filteredData = dataSource.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || item.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Space size={20} direction="vertical" style={{ width: "100%" }}>
      <Typography.Title level={4}>Inventory</Typography.Title>

      <Search
        placeholder="Search by title"
        onChange={(e) => setSearchText(e.target.value)}
        style={{ maxWidth: 300 }}
      />

      <Select
        value={filterCategory}
        onChange={(value) => setFilterCategory(value)}
        style={{ maxWidth: 200 }}
        dropdownStyle={{ minWidth: 300 }}
      >
        <Option value="All">All</Option>
        {[...new Set(dataSource.map((item) => item.category))].map(
          (category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          )
        )}
      </Select>

      {/* Table */}
      <Table
        loading={loading}
        columns={[
          {
            title: "Thumbnail",
            dataIndex: "thumbnail",
            render: (link) => {
              return <Avatar src={link} />;
            },
          },
          {
            title: "Title",
            dataIndex: "title",
          },
          {
            title: "Price",
            dataIndex: "price",
            render: (value) => <span>${Math.round(value)}</span>,
          },
          {
            title: "Rating",
            dataIndex: "rating",
            render: (rating) => {
              return <Rate value={rating} allowHalf disabled />;
            },
          },
          {
            title: "Stock",
            dataIndex: "stock",
          },
          {
            title: "Brand",
            dataIndex: "brand",
          },
          {
            title: "Category",
            dataIndex: "category",
          },
        ]}
        dataSource={filteredData}
        pagination={{
          pageSize: 5,
        }}
      ></Table>
    </Space>
  );
}

export default Inventory;

