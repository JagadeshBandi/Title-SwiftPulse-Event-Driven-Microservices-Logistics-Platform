import { test, expect } from '@playwright/test';
import { ApiClient } from './api-client';
import { TEST_USERS } from '../utils/auth-utils';

test.describe('API Integration Tests', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test.describe('Authentication API', () => {
    test('should login with valid credentials', async () => {
      const response = await apiClient.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
      expect(response.data).toHaveProperty('user');
      expect(response.data.user.email).toBe(TEST_USERS.admin.email);
      expect(response.data.user.role).toBe('ADMIN');
    });

    test('should reject invalid credentials', async () => {
      const response = await apiClient.login('invalid@email.com', 'wrongpassword');
      
      expect(response.status).toBe(401);
      expect(apiClient.getErrorMessage(response)).toContain('Invalid');
    });

    test('should register new user', async () => {
      const newUser = {
        firstName: 'API',
        lastName: 'Test',
        email: 'api-test@example.com',
        password: 'TestPassword123!'
      };

      const response = await apiClient.register(newUser);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('token');
      expect(response.data).toHaveProperty('user');
      expect(response.data.user.email).toBe(newUser.email);
      expect(response.data.user.firstName).toBe(newUser.firstName);
    });

    test('should reject duplicate email registration', async () => {
      const response = await apiClient.register({
        firstName: 'Duplicate',
        lastName: 'Test',
        email: TEST_USERS.admin.email,
        password: 'password123'
      });
      
      expect(response.status).toBe(409);
      expect(apiClient.getErrorMessage(response)).toContain('already exists');
    });

    test('should validate registration data', async () => {
      const response = await apiClient.register({
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        password: '123'
      });
      
      expect(response.status).toBe(400);
      expect(apiClient.getErrorMessage(response)).toContain('validation');
    });

    test('should get user profile with auth token', async () => {
      // Login first
      const loginResponse = await apiClient.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
      apiClient.setAuthToken(loginResponse.data.token);

      // Get profile
      const profileResponse = await apiClient.getProfile();
      
      expect(profileResponse.status).toBe(200);
      expect(profileResponse.data.email).toBe(TEST_USERS.admin.email);
      expect(profileResponse.data.role).toBe('ADMIN');
    });

    test('should reject profile request without auth token', async () => {
      const response = await apiClient.getProfile();
      
      expect(response.status).toBe(401);
    });

    test('should update user profile', async () => {
      // Login first
      const loginResponse = await apiClient.login(TEST_USERS.customer.email, TEST_USERS.customer.password);
      apiClient.setAuthToken(loginResponse.data.token);

      // Update profile
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name'
      };

      const response = await apiClient.updateProfile(updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.firstName).toBe(updateData.firstName);
      expect(response.data.lastName).toBe(updateData.lastName);
    });

    test('should change password', async () => {
      // Login first
      const loginResponse = await apiClient.login(TEST_USERS.customer.email, TEST_USERS.customer.password);
      apiClient.setAuthToken(loginResponse.data.token);

      // Change password
      const response = await apiClient.changePassword(TEST_USERS.customer.password, 'NewPassword123!');
      
      expect(response.status).toBe(200);
      expect(response.data.message).toContain('Password changed');
    });

    test('should logout successfully', async () => {
      // Login first
      const loginResponse = await apiClient.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
      apiClient.setAuthToken(loginResponse.data.token);

      // Logout
      const response = await apiClient.logout();
      
      expect(response.status).toBe(200);
      expect(response.data.message).toContain('logged out');
    });
  });

  test.describe('Orders API', () => {
    let authToken: string;
    let testOrderId: string;

    test.beforeEach(async () => {
      const loginResponse = await apiClient.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
      authToken = loginResponse.data.token;
      apiClient.setAuthToken(authToken);
    });

    test('should get orders list', async () => {
      const response = await apiClient.getOrders();
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('orders');
      expect(response.data).toHaveProperty('total');
      expect(Array.isArray(response.data.orders)).toBe(true);
    });

    test('should get orders with pagination', async () => {
      const response = await apiClient.getOrders({ page: 1, limit: 5 });
      
      expect(response.status).toBe(200);
      expect(response.data.orders.length).toBeLessThanOrEqual(5);
      expect(response.data.page).toBe(1);
    });

    test('should filter orders by status', async () => {
      const response = await apiClient.getOrders({ status: 'PENDING' });
      
      expect(response.status).toBe(200);
      response.data.orders.forEach(order => {
        expect(order.status).toBe('PENDING');
      });
    });

    test('should search orders', async () => {
      const response = await apiClient.getOrders({ search: 'test' });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data.orders)).toBe(true);
    });

    test('should create new order', async () => {
      const orderData = {
        customerId: 'customer-123',
        customerName: 'API Test Customer',
        customerEmail: 'api-customer@example.com',
        customerPhone: '+1234567890',
        pickupAddress: '123 Pickup St, City, State 12345',
        deliveryAddress: '456 Delivery Ave, City, State 67890',
        packageWeight: '2.5',
        packageDimensions: '10x8x6',
        priority: 'STANDARD' as const
      };

      const response = await apiClient.createOrder(orderData);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('trackingNumber');
      expect(response.data.customerName).toBe(orderData.customerName);
      expect(response.data.status).toBe('PENDING');
      
      testOrderId = response.data.id;
    });

    test('should get specific order', async () => {
      // Create an order first
      const createResponse = await apiClient.createOrder({
        customerId: 'customer-456',
        customerName: 'Get Order Test',
        customerEmail: 'get-order@example.com',
        customerPhone: '+1234567890',
        pickupAddress: '123 Pickup St',
        deliveryAddress: '456 Delivery Ave',
        packageWeight: '1.0',
        packageDimensions: '5x5x5',
        priority: 'EXPRESS' as const
      });

      const orderId = createResponse.data.id;

      // Get the order
      const response = await apiClient.getOrder(orderId);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(orderId);
      expect(response.data.customerName).toBe('Get Order Test');
    });

    test('should update order', async () => {
      // Create an order first
      const createResponse = await apiClient.createOrder({
        customerId: 'customer-789',
        customerName: 'Update Test',
        customerEmail: 'update@example.com',
        customerPhone: '+1234567890',
        pickupAddress: '123 Pickup St',
        deliveryAddress: '456 Delivery Ave',
        packageWeight: '1.0',
        packageDimensions: '5x5x5',
        priority: 'STANDARD' as const
      });

      const orderId = createResponse.data.id;

      // Update the order
      const updateData = {
        customerName: 'Updated Name',
        priority: 'EXPRESS' as const
      };

      const response = await apiClient.updateOrder(orderId, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.customerName).toBe(updateData.customerName);
      expect(response.data.priority).toBe(updateData.priority);
    });

    test('should update order status', async () => {
      // Create an order first
      const createResponse = await apiClient.createOrder({
        customerId: 'customer-status',
        customerName: 'Status Test',
        customerEmail: 'status@example.com',
        customerPhone: '+1234567890',
        pickupAddress: '123 Pickup St',
        deliveryAddress: '456 Delivery Ave',
        packageWeight: '1.0',
        packageDimensions: '5x5x5',
        priority: 'STANDARD' as const
      });

      const orderId = createResponse.data.id;

      // Update status
      const response = await apiClient.updateOrderStatus(orderId, 'CONFIRMED');
      
      expect(response.status).toBe(200);
      expect(response.data.status).toBe('CONFIRMED');
    });

    test('should add note to order', async () => {
      // Create an order first
      const createResponse = await apiClient.createOrder({
        customerId: 'customer-note',
        customerName: 'Note Test',
        customerEmail: 'note@example.com',
        customerPhone: '+1234567890',
        pickupAddress: '123 Pickup St',
        deliveryAddress: '456 Delivery Ave',
        packageWeight: '1.0',
        packageDimensions: '5x5x5',
        priority: 'STANDARD' as const
      });

      const orderId = createResponse.data.id;

      // Add note
      const response = await apiClient.addOrderNote(orderId, 'Test note for order');
      
      expect(response.status).toBe(200);
      expect(response.data.message).toContain('Note added');
    });

    test('should delete order', async () => {
      // Create an order first
      const createResponse = await apiClient.createOrder({
        customerId: 'customer-delete',
        customerName: 'Delete Test',
        customerEmail: 'delete@example.com',
        customerPhone: '+1234567890',
        pickupAddress: '123 Pickup St',
        deliveryAddress: '456 Delivery Ave',
        packageWeight: '1.0',
        packageDimensions: '5x5x5',
        priority: 'STANDARD' as const
      });

      const orderId = createResponse.data.id;

      // Delete the order
      const response = await apiClient.deleteOrder(orderId);
      
      expect(response.status).toBe(200);
      expect(response.data.message).toContain('deleted');
    });

    test('should handle non-existent order', async () => {
      const response = await apiClient.getOrder('non-existent-id');
      
      expect(response.status).toBe(404);
      expect(apiClient.getErrorMessage(response)).toContain('not found');
    });

    test('should validate order data', async () => {
      const invalidOrderData = {
        customerId: '',
        customerName: '',
        customerEmail: 'invalid-email',
        customerPhone: '',
        pickupAddress: '',
        deliveryAddress: '',
        packageWeight: '',
        packageDimensions: '',
        priority: 'INVALID' as any
      };

      const response = await apiClient.createOrder(invalidOrderData);
      
      expect(response.status).toBe(400);
      expect(apiClient.getErrorMessage(response)).toContain('validation');
    });
  });

  test.describe('Tracking API', () => {
    test.beforeEach(async () => {
      const loginResponse = await apiClient.login(TEST_USERS.customer.email, TEST_USERS.customer.password);
      apiClient.setAuthToken(loginResponse.data.token);
    });

    test('should get tracking information', async () => {
      const trackingNumber = 'TRK123456789';
      
      const response = await apiClient.getTrackingInfo(trackingNumber);
      
      expect(response.status).toBe(200);
      expect(response.data.trackingNumber).toBe(trackingNumber);
      expect(response.data).toHaveProperty('status');
      expect(response.data).toHaveProperty('timeline');
      expect(Array.isArray(response.data.timeline)).toBe(true);
    });

    test('should handle invalid tracking number', async () => {
      const response = await apiClient.getTrackingInfo('INVALID123');
      
      expect(response.status).toBe(404);
      expect(apiClient.getErrorMessage(response)).toContain('not found');
    });

    test('should update tracking location', async () => {
      const trackingNumber = 'TRK123456789';
      const locationData = {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Current Location, City, State'
      };

      // This might require driver permissions
      const response = await apiClient.updateTrackingLocation(trackingNumber, locationData);
      
      // Might be 403 if customer doesn't have permission
      expect([200, 403]).toContain(response.status);
    });

    test('should add tracking event', async () => {
      const trackingNumber = 'TRK123456789';
      const eventData = {
        status: 'IN_TRANSIT',
        location: 'Distribution Center',
        description: 'Package in transit'
      };

      // This might require driver/admin permissions
      const response = await apiClient.addTrackingEvent(trackingNumber, eventData);
      
      // Might be 403 if customer doesn't have permission
      expect([200, 403]).toContain(response.status);
    });
  });

  test.describe('Admin API', () => {
    test.beforeEach(async () => {
      const loginResponse = await apiClient.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
      apiClient.setAuthToken(loginResponse.data.token);
    });

    test('should get users list', async () => {
      const response = await apiClient.getUsers();
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('users');
      expect(response.data).toHaveProperty('total');
      expect(Array.isArray(response.data.users)).toBe(true);
    });

    test('should filter users by role', async () => {
      const response = await apiClient.getUsers({ role: 'CUSTOMER' });
      
      expect(response.status).toBe(200);
      response.data.users.forEach(user => {
        expect(user.role).toBe('CUSTOMER');
      });
    });

    test('should get system stats', async () => {
      const response = await apiClient.getSystemStats();
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('totalOrders');
      expect(response.data).toHaveProperty('totalUsers');
      expect(response.data).toHaveProperty('activeDeliveries');
      expect(response.data).toHaveProperty('completedDeliveries');
      expect(response.data).toHaveProperty('revenue');
      
      // Verify data types
      expect(typeof response.data.totalOrders).toBe('number');
      expect(typeof response.data.totalUsers).toBe('number');
    });

    test('should update user as admin', async () => {
      // Get users first
      const usersResponse = await apiClient.getUsers();
      const testUser = usersResponse.data.users.find(u => u.email === TEST_USERS.customer.email);
      
      if (testUser) {
        const updateData = {
          isActive: false
        };

        const response = await apiClient.updateUser(testUser.id, updateData);
        
        expect(response.status).toBe(200);
        expect(response.data.isActive).toBe(false);

        // Restore user
        await apiClient.updateUser(testUser.id, { isActive: true });
      }
    });

    test('should reject admin operations for non-admin users', async () => {
      // Login as customer
      const customerLoginResponse = await apiClient.login(TEST_USERS.customer.email, TEST_USERS.customer.password);
      apiClient.setAuthToken(customerLoginResponse.data.token);

      // Try admin endpoint
      const response = await apiClient.getUsers();
      
      expect(response.status).toBe(403);
      expect(apiClient.getErrorMessage(response)).toContain('Forbidden');
    });
  });

  test.describe('Notifications API', () => {
    test.beforeEach(async () => {
      const loginResponse = await apiClient.login(TEST_USERS.customer.email, TEST_USERS.customer.password);
      apiClient.setAuthToken(loginResponse.data.token);
    });

    test('should get notifications', async () => {
      const response = await apiClient.getNotifications();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Verify notification structure
      if (response.data.length > 0) {
        const notification = response.data[0];
        expect(notification).toHaveProperty('id');
        expect(notification).toHaveProperty('type');
        expect(notification).toHaveProperty('title');
        expect(notification).toHaveProperty('message');
        expect(notification).toHaveProperty('read');
        expect(notification).toHaveProperty('createdAt');
      }
    });

    test('should mark notification as read', async () => {
      // Get notifications first
      const notificationsResponse = await apiClient.getNotifications();
      
      if (notificationsResponse.data.length > 0) {
        const notificationId = notificationsResponse.data[0].id;
        
        const response = await apiClient.markNotificationAsRead(notificationId);
        
        expect(response.status).toBe(200);
        expect(response.data.message).toContain('marked as read');
      }
    });

    test('should mark all notifications as read', async () => {
      const response = await apiClient.markAllNotificationsAsRead();
      
      expect(response.status).toBe(200);
      expect(response.data.message).toContain('all notifications');
    });
  });

  test.describe('Health Check API', () => {
    test('should return health status', async () => {
      const response = await apiClient.healthCheck();
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('status');
      expect(response.data).toHaveProperty('timestamp');
      expect(response.data).toHaveProperty('services');
      expect(response.data.services).toHaveProperty('database');
      expect(response.data.services).toHaveProperty('kafka');
      expect(response.data.services).toHaveProperty('redis');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle malformed requests', async () => {
      const response = await apiClient.makeRequest('POST', '/api/auth/login', 'invalid-json');
      
      expect(response.status).toBe(400);
    });

    test('should handle missing endpoints', async () => {
      const response = await apiClient.makeRequest('GET', '/api/non-existent');
      
      expect(response.status).toBe(404);
    });

    test('should handle rate limiting', async () => {
      // Make multiple rapid requests
      const promises = Array(10).fill(null).map(() => 
        apiClient.login('test@example.com', 'password')
      );

      const responses = await Promise.all(promises);
      
      // At least one should be rate limited
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  test.describe('Performance Tests', () => {
    test('should handle concurrent requests', async () => {
      // Login first
      const loginResponse = await apiClient.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
      apiClient.setAuthToken(loginResponse.data.token);

      // Make concurrent requests
      const startTime = Date.now();
      
      const promises = Array(20).fill(null).map(() => apiClient.getOrders());
      const responses = await Promise.all(promises);
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // All requests should succeed
      expect(responses.every(r => r.status === 200)).toBe(true);
      
      // Should complete within reasonable time (adjust as needed)
      expect(totalTime).toBeLessThan(5000);
    });

    test('should handle large data sets', async () => {
      // Login first
      const loginResponse = await apiClient.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
      apiClient.setAuthToken(loginResponse.data.token);

      // Request large page size
      const response = await apiClient.getOrders({ limit: 100 });
      
      expect(response.status).toBe(200);
      expect(response.data.orders.length).toBeLessThanOrEqual(100);
    });
  });

  test.describe('Security Tests', () => {
    test('should reject requests without auth token', async () => {
      apiClient.clearAuthToken();
      
      const response = await apiClient.getOrders();
      
      expect(response.status).toBe(401);
    });

    test('should reject invalid auth token', async () => {
      apiClient.setAuthToken('invalid-token');
      
      const response = await apiClient.getOrders();
      
      expect(response.status).toBe(401);
    });

    test('should handle SQL injection attempts', async () => {
      const maliciousInput = "'; DROP TABLE users; --";
      
      const response = await apiClient.getOrders({ search: maliciousInput });
      
      // Should handle gracefully (either 400 for bad input or 200 with sanitized results)
      expect([200, 400]).toContain(response.status);
    });

    test('should handle XSS attempts', async () => {
      const xssPayload = '<script>alert("xss")</script>';
      
      const response = await apiClient.getOrders({ search: xssPayload });
      
      // Should handle gracefully
      expect([200, 400]).toContain(response.status);
      
      // If successful, response should not contain the script tag
      if (response.status === 200) {
        expect(JSON.stringify(response.data)).not.toContain('<script>');
      }
    });
  });
});
