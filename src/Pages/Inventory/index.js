import { Avatar, Rate, Space, Table, Typography, Input, Select, Button, Modal, Form } from "antd";
import { useEffect, useState } from "react";
import { getInventory } from "../../API";

const { Search } = Input;
const { Option } = Select;

function Inventory() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setLoading(true);
    getInventory().then((res) => {
      setDataSource(res.products);
      setLoading(false);
    });
  }, []);

  const filteredData = dataSource.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || item.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedData = dataSource.map((product) =>
          product.id === selectedProduct.id ? { ...product, ...values } : product
        );
        setDataSource(updatedData);

        setIsModalVisible(false);
        setSelectedProduct(null);
      })
      .catch((info) => {
        console.error("Validate Failed:", info);
      });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  return (
    <Space size={20} direction="vertical" style={{ width: "100%" }}>
      <Typography.Title level={4}>Inventory</Typography.Title>

      <Space direction="horizontal" style={{ gap: "10px" }}>
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
      </Space>

      <Table
        loading={loading}
        columns={[
          {
            title: "Image",
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
            title: "Price($)",
            dataIndex: "price",
            sorter: (a, b) => a.price - b.price,
            render: (value) => <span>{Math.round(value)}</span>,
          },
          {
            title: "Rating",
            dataIndex: "rating",
            sorter: (a, b) => a.rating - b.rating,
            render: (rating) => {
              return <Rate value={rating} allowHalf disabled />;
            },
          },
          {
            title: "Stock",
            dataIndex: "stock",
          },
          {
            title: "Category",
            dataIndex: "category",
          },
          {
            title: "Action",
            dataIndex: "action",
            render: (_, product) => (
              <Button onClick={() => handleEditClick(product)}>Edit</Button>
            ),
          },
        ]}
        dataSource={filteredData}
        pagination={{
          pageSize: 5,
        }}
        onChange={(pagination, filters, sorter) => {
          console.log('Sorter:', sorter);
        }}
      ></Table>

      <Modal
        title="Edit Product Details"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical" initialValues={selectedProduct}>
          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Please enter the price" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Stock"
            name="stock"
            rules={[
              { required: true, message: "Please enter the stock quantity" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select>
              {[...new Set(dataSource.map((item) => item.category))].map(
                (category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                )
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}

export default Inventory;
