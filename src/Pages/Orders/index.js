import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Stack } from '@mui/material';
import { useEffect, useState } from "react";
import { getOrders } from "../../API";

function Orders() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setLoading(true);
    getOrders().then((res) => {
      setDataSource(res.products);
      setLoading(false);
    });
  }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Orders</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">Price($)</TableCell>
              <TableCell align="right">Discounted Price($)</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Total($)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {
        dataSource.map((row) => (
         <TableRow key={row.title}>
         <TableCell>{row.title}</TableCell>
           <TableCell align="right">{Math.round(row.price)}</TableCell>
           <TableCell align="right">{Math.round(row.discountedTotal)}</TableCell>
           <TableCell align="right">{row.quantity}</TableCell>
           <TableCell align="right">{Math.round(row.total)}</TableCell>
         </TableRow>
  ))}
        </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default Orders;
