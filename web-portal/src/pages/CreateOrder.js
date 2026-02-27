import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const steps = ['Package Details', 'Pickup Address', 'Delivery Address', 'Review'];

const CreateOrder = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    description: '',
    weight: '',
    packageType: 'PACKAGE',
    deliveryType: 'STANDARD',
    priorityLevel: 'MEDIUM',
    pickupStreet: '',
    pickupCity: '',
    pickupState: '',
    pickupZip: '',
    deliveryStreet: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryZip: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const orderData = {
        description: formData.description,
        weight: parseFloat(formData.weight),
        packageType: formData.packageType,
        deliveryType: formData.deliveryType,
        priorityLevel: formData.priorityLevel,
        pickupAddress: {
          streetAddress: formData.pickupStreet,
          city: formData.pickupCity,
          state: formData.pickupState,
          zipCode: formData.pickupZip,
          country: 'USA',
        },
        deliveryAddress: {
          streetAddress: formData.deliveryStreet,
          city: formData.deliveryCity,
          state: formData.deliveryState,
          zipCode: formData.deliveryZip,
          country: 'USA',
        },
      };

      await axios.post('/api/orders', orderData);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={2}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Package Type</InputLabel>
                <Select
                  name="packageType"
                  value={formData.packageType}
                  onChange={handleChange}
                >
                  <MenuItem value="ENVELOPE">Envelope</MenuItem>
                  <MenuItem value="PACKAGE">Package</MenuItem>
                  <MenuItem value="BOX">Box</MenuItem>
                  <MenuItem value="PALLET">Pallet</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Delivery Type</InputLabel>
                <Select
                  name="deliveryType"
                  value={formData.deliveryType}
                  onChange={handleChange}
                >
                  <MenuItem value="STANDARD">Standard</MenuItem>
                  <MenuItem value="EXPRESS">Express</MenuItem>
                  <MenuItem value="OVERNIGHT">Overnight</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority Level</InputLabel>
                <Select
                  name="priorityLevel"
                  value={formData.priorityLevel}
                  onChange={handleChange}
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Street Address"
                name="pickupStreet"
                value={formData.pickupStreet}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                name="pickupCity"
                value={formData.pickupCity}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="State"
                name="pickupState"
                value={formData.pickupState}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="ZIP Code"
                name="pickupZip"
                value={formData.pickupZip}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Street Address"
                name="deliveryStreet"
                value={formData.deliveryStreet}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                name="deliveryCity"
                value={formData.deliveryCity}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="State"
                name="deliveryState"
                value={formData.deliveryState}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="ZIP Code"
                name="deliveryZip"
                value={formData.deliveryZip}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2">Package Details:</Typography>
              <Typography>Description: {formData.description}</Typography>
              <Typography>Weight: {formData.weight} kg</Typography>
              <Typography>Package Type: {formData.packageType}</Typography>
              <Typography>Delivery Type: {formData.deliveryType}</Typography>
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2">Pickup Address:</Typography>
              <Typography>
                {formData.pickupStreet}, {formData.pickupCity},{' '}
                {formData.pickupState} {formData.pickupZip}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2">Delivery Address:</Typography>
              <Typography>
                {formData.deliveryStreet}, {formData.deliveryCity},{' '}
                {formData.deliveryState} {formData.deliveryZip}
              </Typography>
            </Paper>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Order
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Order'}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateOrder;
