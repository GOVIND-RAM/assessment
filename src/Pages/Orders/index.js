import * as React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Stack, Button, Dialog, DialogTitle, DialogContent, Card, CardContent
} from '@mui/material';
import { useEffect, useState } from "react";
import { getOrders } from "../../API";

function Orders() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [summaryData, setSummaryData] = useState({ highestPurchased: {}, mostOrderedItem: {} });

  useEffect(() => {
    setLoading(true);
    getOrders()
      .then((res) => {
        setDataSource(res.products); 
       
        const highestPurchased = res.products.reduce((prev, curr) => prev.total > curr.total ? prev : curr, {});
        const mostOrderedItem = res.products.reduce((prev, curr) => prev.quantity > curr.quantity ? prev : curr, {});
        setSummaryData({ highestPurchased, mostOrderedItem });

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);

  const handleRowClick = (row) => {
    setSelectedOrder(row);
  };

  const handleClose = () => {
    setSelectedOrder(null);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Orders</Typography>

      <Stack direction="row" spacing={2}>
        <Card>
          <CardContent>
            <Typography variant="h6">Highest Purchased Order</Typography>
            <Typography>Title: {summaryData.highestPurchased.title || "N/A"}</Typography>
            <Typography>Total: {Math.round(summaryData.highestPurchased.total) || "N/A"}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6">Most Ordered Item</Typography>
            <Typography>Title: {summaryData.mostOrderedItem.title || "N/A"}</Typography>
            <Typography>Quantity: {summaryData.mostOrderedItem.quantity || "N/A"}</Typography>
          </CardContent>
        </Card>
      </Stack>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Price(₹)</TableCell>
              <TableCell align="right">Discounted Price(₹)</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Total(₹)</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataSource.map((row, index) => (
              <TableRow
                key={index}
                onClick={() => handleRowClick(row)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell>{row.id || index + 1}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.userName}</TableCell>
                <TableCell align="center">{row.status}</TableCell>
                <TableCell align="right">{Math.round(row.price)}</TableCell>
                <TableCell align="right">{Math.round(row.discountedTotal)}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{Math.round(row.total)}</TableCell>
                <TableCell align="center">
                  <Button variant="outlined" onClick={() => handleRowClick(row)}>Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!selectedOrder} onClose={handleClose}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <Typography>Order ID: {selectedOrder.id}</Typography>
              <Typography>Title: {selectedOrder.title}</Typography>
              <Typography>User Name: {selectedOrder.userName}</Typography>
              <Typography>Status: {selectedOrder.status}</Typography>
              <Typography>Price: {Math.round(selectedOrder.price)}</Typography>
              <Typography>Discounted Price: {Math.round(selectedOrder.discountedTotal)}</Typography>
              <Typography>Quantity: {selectedOrder.quantity}</Typography>
              <Typography>Total: {Math.round(selectedOrder.total)}</Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Stack>
  );
}

export default Orders;
