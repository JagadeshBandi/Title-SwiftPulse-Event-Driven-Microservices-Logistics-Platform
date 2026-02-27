import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';

const trackingSteps = [
  'Order Created',
  'Package Picked Up',
  'In Transit',
  'Out for Delivery',
  'Delivered',
];

const Tracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`/api/tracking/${trackingNumber}`);
      setTrackingData(response.data);
    } catch (err) {
      setError('Tracking information not found');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  const getActiveStep = (status) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'CONFIRMED':
        return 1;
      case 'IN_TRANSIT':
        return 2;
      case 'OUT_FOR_DELIVERY':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Track Your Shipment
      </Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter tracking number..."
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Track'}
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>

      {trackingData && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Shipment Status
              </Typography>
              <Stepper
                activeStep={getActiveStep(trackingData.status)}
                alternativeLabel
              >
                {trackingSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Live Location
                </Typography>
                <Box sx={{ height: 400, mt: 2 }}>
                  <MapContainer
                    center={[
                      trackingData.currentLocation?.lat || 40.7128,
                      trackingData.currentLocation?.lng || -74.006,
                    ]}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {trackingData.currentLocation && (
                      <Marker
                        position={[
                          trackingData.currentLocation.lat,
                          trackingData.currentLocation.lng,
                        ]}
                      >
                        <Popup>Current Location</Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Shipment Details
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Tracking Number:</strong>
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {trackingData.trackingNumber}
                </Typography>

                <Typography variant="body2" color="textSecondary">
                  <strong>Status:</strong>
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {trackingData.status}
                </Typography>

                {trackingData.estimatedDelivery && (
                  <>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Estimated Delivery:</strong>
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {new Date(trackingData.estimatedDelivery).toLocaleDateString()}
                    </Typography>
                  </>
                )}

                <Typography variant="body2" color="textSecondary">
                  <strong>Last Updated:</strong>
                </Typography>
                <Typography variant="body1">
                  {new Date(trackingData.lastUpdate).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Tracking;
