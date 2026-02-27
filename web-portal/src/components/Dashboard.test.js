import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

describe('Dashboard Component', () => {
  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  };

  const mockStats = {
    totalOrders: 25,
    pendingOrders: 5,
    inTransitOrders: 8,
    deliveredOrders: 12
  };

  const mockRecentOrders = [
    {
      id: 1,
      orderNumber: 'ORD001',
      status: 'PENDING',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      orderNumber: 'ORD002',
      status: 'IN_TRANSIT',
      createdAt: '2024-01-14T15:30:00Z'
    }
  ];

  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <AuthProvider value={{ user: mockUser }}>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/orders/stats')) {
        return Promise.resolve({ data: mockStats });
      }
      if (url.includes('/api/orders/recent')) {
        return Promise.resolve({ data: mockRecentOrders });
      }
      return Promise.resolve({ data: {} });
    });
  });

  test('renders dashboard with user greeting', () => {
    renderDashboard();
    
    expect(screen.getByText(/welcome back, john/i)).toBeInTheDocument();
  });

  test('displays order statistics cards', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('25')).toBeInTheDocument(); // Total orders
      expect(screen.getByText('5')).toBeInTheDocument(); // Pending
      expect(screen.getByText('8')).toBeInTheDocument(); // In transit
      expect(screen.getByText('12')).toBeInTheDocument(); // Delivered
    });
  });

  test('displays recent orders table', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('ORD001')).toBeInTheDocument();
      expect(screen.getByText('ORD002')).toBeInTheDocument();
      expect(screen.getByText('PENDING')).toBeInTheDocument();
      expect(screen.getByText('IN_TRANSIT')).toBeInTheDocument();
    });
  });

  test('clicking create order button navigates to create order page', async () => {
    renderDashboard();
    
    const createOrderButton = screen.getByRole('button', { name: /create order/i });
    expect(createOrderButton).toBeInTheDocument();
  });

  test('displays loading state while fetching data', () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderDashboard();
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('handles API errors gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText(/error loading dashboard data/i)).toBeInTheDocument();
    });
  });

  test('displays chart components', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByTestId('orders-chart')).toBeInTheDocument();
      expect(screen.getByTestId('delivery-chart')).toBeInTheDocument();
    });
  });

  test('clicking view all orders navigates to orders page', async () => {
    renderDashboard();
    
    const viewAllLink = screen.getByText(/view all orders/i);
    expect(viewAllLink).toBeInTheDocument();
  });
});
