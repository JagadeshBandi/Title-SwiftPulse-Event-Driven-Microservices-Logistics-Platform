import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import axios from 'axios';

const getStatusColor = (status) => {
  switch (status) {
    case 'DELIVERED':
      return 'success';
    case 'IN_TRANSIT':
      return 'warning';
    case 'PENDING':
      return 'default';
    case 'CANCELLED':
      return 'error';
    default:
      return 'primary';
  }
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6">Order not found</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/orders')}
          sx={{ mt: 2 }}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/orders')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4">Order Details</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Order #{order.orderNumber}
              </Typography>
              <Chip
                label={order.status}
                color={getStatusColor(order.status)}
              />
            </Box>

            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <strong>Tracking Number:</strong>
                  </TableCell>
                  <TableCell>{order.trackingNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <strong>Description:</strong>
                  </TableCell>
                  <TableCell>{order.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <strong>Weight:</strong>
                  </TableCell>
                  <TableCell>{order.weight} kg</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <strong>Package Type:</strong>
                  </TableCell>
                  <TableCell>{order.packageType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <strong>Delivery Type:</strong>
                  </TableCell>
                  <TableCell>{order.deliveryType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <strong>Priority:</strong>
                  </TableCell>
                  <TableCell>{order.priorityLevel}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <strong>Created:</strong>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tracking Timeline
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Tracking updates will appear here once the order is in transit.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pickup Address
            </Typography>
            <Typography variant="body2">
              {order.pickupAddress?.streetAddress}
            </Typography>
            <Typography variant="body2">
              {order.pickupAddress?.city}, {order.pickupAddress?.state}{' '}
              {order.pickupAddress?.zipCode}
            </Typography>
            <Typography variant="body2">
              {order.pickupAddress?.country}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Delivery Address
            </Typography>
            <Typography variant="body2">
              {order.deliveryAddress?.streetAddress}
            </Typography>
            <Typography variant="body2">
              {order.deliveryAddress?.city}, {order.deliveryAddress?.state}{' '}
              {order.deliveryAddress?.zipCode}
            </Typography>
            <Typography variant="body2">
              {order.deliveryAddress?.country}
            </Typography>

            {order.estimatedDeliveryDate && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Estimated Delivery
                </Typography>
                <Typography variant="body2">
                  {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetail;
