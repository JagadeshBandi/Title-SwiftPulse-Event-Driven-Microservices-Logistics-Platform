import { APIRequestContext, APIResponse } from '@playwright/test';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER' | 'DRIVER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  packageWeight: string;
  packageDimensions: string;
  priority: 'STANDARD' | 'EXPRESS' | 'OVERNIGHT';
  status: 'PENDING' | 'CONFIRMED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  trackingNumber: string;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingInfo {
  trackingNumber: string;
  status: string;
  estimatedDelivery: string;
  currentLocation?: string;
  driver?: {
    name: string;
    phone: string;
    photo?: string;
  };
  timeline: TrackingEvent[];
}

export interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export class ApiClient {
  private request: APIRequestContext;
  private baseURL: string;
  private authToken?: string;

  constructor(request: APIRequestContext, baseURL: string = 'http://localhost:8080') {
    this.request = request;
    this.baseURL = baseURL;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = undefined;
  }

  /**
   * Get default headers
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Make API request with error handling
   */
  private async makeRequest<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders();

    try {
      let response: APIResponse;

      switch (method) {
        case 'GET':
          response = await this.request.get(url, { headers });
          break;
        case 'POST':
          response = await this.request.post(url, { headers, data });
          break;
        case 'PUT':
          response = await this.request.put(url, { headers, data });
          break;
        case 'DELETE':
          response = await this.request.delete(url, { headers });
          break;
        case 'PATCH':
          response = await this.request.patch(url, { headers, data });
          break;
      }

      const responseData = await response.json().catch(() => ({}));
      const responseHeaders: Record<string, string> = {};
      
      response.headers().forEach((value, key) => {
        responseHeaders[key] = value;
      });

      return {
        data: responseData,
        status: response.status(),
        statusText: response.statusText(),
        headers: responseHeaders
      };
    } catch (error) {
      throw new Error(`API request failed: ${error}`);
    }
  }

  /**
   * Authentication endpoints
   */
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> {
    return this.makeRequest('POST', '/api/auth/login', { email, password });
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{ token: string; user: User }>> {
    return this.makeRequest('POST', '/api/auth/register', userData);
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest('POST', '/api/auth/logout');
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.makeRequest('GET', '/api/auth/profile');
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.makeRequest('PUT', '/api/auth/profile', userData);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest('POST', '/api/auth/change-password', { currentPassword, newPassword });
  }

  /**
   * Order endpoints
   */
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<{ orders: Order[]; total: number; page: number; totalPages: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString() ? `/api/orders?${queryParams}` : '/api/orders';
    return this.makeRequest('GET', endpoint);
  }

  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    return this.makeRequest('GET', `/api/orders/${orderId}`);
  }

  async createOrder(orderData: Omit<Order, 'id' | 'trackingNumber' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Order>> {
    return this.makeRequest('POST', '/api/orders', orderData);
  }

  async updateOrder(orderId: string, orderData: Partial<Order>): Promise<ApiResponse<Order>> {
    return this.makeRequest('PUT', `/api/orders/${orderId}`, orderData);
  }

  async deleteOrder(orderId: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest('DELETE', `/api/orders/${orderId}`);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse<Order>> {
    return this.makeRequest('PATCH', `/api/orders/${orderId}/status`, { status });
  }

  async addOrderNote(orderId: string, note: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest('POST', `/api/orders/${orderId}/notes`, { note });
  }

  async assignDriver(orderId: string, driverId: string): Promise<ApiResponse<Order>> {
    return this.makeRequest('POST', `/api/orders/${orderId}/assign-driver`, { driverId });
  }

  /**
   * Tracking endpoints
   */
  async getTrackingInfo(trackingNumber: string): Promise<ApiResponse<TrackingInfo>> {
    return this.makeRequest('GET', `/api/tracking/${trackingNumber}`);
  }

  async updateTrackingLocation(trackingNumber: string, location: {
    latitude: number;
    longitude: number;
    address: string;
  }): Promise<ApiResponse<TrackingInfo>> {
    return this.makeRequest('POST', `/api/tracking/${trackingNumber}/location`, location);
  }

  async addTrackingEvent(trackingNumber: string, event: {
    status: string;
    location: string;
    description: string;
  }): Promise<ApiResponse<TrackingInfo>> {
    return this.makeRequest('POST', `/api/tracking/${trackingNumber}/events`, event);
  }

  /**
   * Admin endpoints
   */
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }): Promise<ApiResponse<{ users: User[]; total: number; page: number; totalPages: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString() ? `/api/admin/users?${queryParams}` : '/api/admin/users';
    return this.makeRequest('GET', endpoint);
  }

  async getUser(userId: string): Promise<ApiResponse<User>> {
    return this.makeRequest('GET', `/api/admin/users/${userId}`);
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.makeRequest('PUT', `/api/admin/users/${userId}`, userData);
  }

  async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest('DELETE', `/api/admin/users/${userId}`);
  }

  async getSystemStats(): Promise<ApiResponse<{
    totalOrders: number;
    totalUsers: number;
    activeDeliveries: number;
    completedDeliveries: number;
    revenue: number;
  }>> {
    return this.makeRequest('GET', '/api/admin/stats');
  }

  /**
   * Notification endpoints
   */
  async getNotifications(): Promise<ApiResponse<{
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
  }[]>> {
    return this.makeRequest('GET', '/api/notifications');
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest('PATCH', `/api/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest('POST', '/api/notifications/mark-all-read');
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<ApiResponse<{
    status: string;
    timestamp: string;
    services: {
      database: string;
      kafka: string;
      redis: string;
    };
  }>> {
    return this.makeRequest('GET', '/api/health');
  }

  /**
   * Utility methods
   */
  async isSuccess<T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } {
    return response.status >= 200 && response.status < 300;
  }

  async isError<T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: ApiError } {
    return response.status >= 400;
  }

  getErrorMessage(response: ApiResponse<ApiError>): string {
    if (typeof response.data === 'object' && response.data.message) {
      return response.data.message;
    }
    return response.statusText || 'Unknown error';
  }

  /**
   * Batch operations
   */
  async createMultipleOrders(orders: Omit<Order, 'id' | 'trackingNumber' | 'status' | 'createdAt' | 'updatedAt'>[]): Promise<ApiResponse<Order[]>> {
    return this.makeRequest('POST', '/api/orders/batch', { orders });
  }

  async updateMultipleOrders(updates: { orderId: string; data: Partial<Order> }[]): Promise<ApiResponse<Order[]>> {
    return this.makeRequest('PATCH', '/api/orders/batch', { updates });
  }

  async deleteMultipleOrders(orderIds: string[]): Promise<ApiResponse<{ message: string; deletedCount: number }>> {
    return this.makeRequest('DELETE', '/api/orders/batch', { orderIds });
  }

  /**
   * Search and filtering
   */
  async searchOrders(query: string, filters?: {
    status?: string;
    priority?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<{ orders: Order[]; total: number }>> {
    const params = new URLSearchParams({ query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value);
        }
      });
    }

    return this.makeRequest('GET', `/api/orders/search?${params}`);
  }

  async advancedSearch(criteria: {
    customerName?: string;
    customerEmail?: string;
    trackingNumber?: string;
    pickupAddress?: string;
    deliveryAddress?: string;
    status?: string[];
    priority?: string[];
    dateRange?: {
      from: string;
      to: string;
    };
  }): Promise<ApiResponse<{ orders: Order[]; total: number }>> {
    return this.makeRequest('POST', '/api/orders/advanced-search', criteria);
  }

  /**
   * Export functionality
   */
  async exportOrders(format: 'csv' | 'excel' | 'pdf', filters?: any): Promise<ApiResponse<{ downloadUrl: string }>> {
    const params = new URLSearchParams({ format });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    return this.makeRequest('GET', `/api/orders/export?${params}`);
  }

  /**
   * Analytics and reporting
   */
  async getOrderAnalytics(period: 'daily' | 'weekly' | 'monthly'): Promise<ApiResponse<{
    period: string;
    data: Array<{
      date: string;
      orders: number;
      revenue: number;
      completedDeliveries: number;
    }>;
  }>> {
    return this.makeRequest('GET', `/api/analytics/orders?period=${period}`);
  }

  async getDeliveryPerformance(): Promise<ApiResponse<{
    onTimeDeliveryRate: number;
    averageDeliveryTime: number;
    deliveryByStatus: Record<string, number>;
    deliveryByPriority: Record<string, number>;
  }>> {
    return this.makeRequest('GET', '/api/analytics/delivery-performance');
  }

  /**
   * WebSocket connection simulation for testing
   */
  async simulateWebSocketUpdate(type: string, data: any): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest('POST', '/api/test/websocket', { type, data });
  }
}
