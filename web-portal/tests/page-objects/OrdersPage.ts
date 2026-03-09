import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrdersPage extends BasePage {
  readonly page: Page;
  
  // Navigation and actions
  readonly createOrderButton: Locator;
  readonly filterButton: Locator;
  readonly searchInput: Locator;
  readonly sortDropdown: Locator;
  
  // Order list
  readonly ordersList: Locator;
  readonly orderItems: Locator;
  readonly orderCard: Locator;
  readonly orderTable: Locator;
  
  // Order details
  readonly orderId: Locator;
  readonly orderStatus: Locator;
  readonly orderDate: Locator;
  readonly orderTotal: Locator;
  readonly orderCustomer: Locator;
  readonly orderAddress: Locator;
  
  // Create order form
  readonly createOrderModal: Locator;
  readonly customerNameInput: Locator;
  readonly customerEmailInput: Locator;
  readonly customerPhoneInput: Locator;
  readonly pickupAddressInput: Locator;
  readonly deliveryAddressInput: Locator;
  readonly packageWeightInput: Locator;
  readonly packageDimensionsInput: Locator;
  readonly priorityDropdown: Locator;
  readonly saveOrderButton: Locator;
  readonly cancelButton: Locator;
  
  // Order actions
  readonly viewOrderButton: Locator;
  readonly editOrderButton: Locator;
  readonly deleteOrderButton: Locator;
  readonly trackOrderButton: Locator;
  readonly assignDriverButton: Locator;
  
  // Order status updates
  readonly statusDropdown: Locator;
  readonly addNoteButton: Locator;
  readonly noteTextarea: Locator;
  readonly saveNoteButton: Locator;
  
  // Pagination
  readonly pagination: Locator;
  readonly nextPageButton: Locator;
  readonly prevPageButton: Locator;
  readonly pageInfo: Locator;
  
  // Filters
  readonly statusFilter: Locator;
  readonly dateFilter: Locator;
  readonly customerFilter: Locator;
  readonly clearFiltersButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    
    // Navigation
    this.createOrderButton = page.locator('button:has-text("Create Order"), button:has-text("New Order")');
    this.filterButton = page.locator('button:has-text("Filter"), .filter-button');
    this.searchInput = page.locator('input[placeholder*="search"], input[name="search"]');
    this.sortDropdown = page.locator('select[name="sort"], .sort-dropdown');
    
    // Order list
    this.ordersList = page.locator('[data-testid="orders-list"], .orders-list');
    this.orderItems = page.locator('[data-testid="order-item"], .order-item, tr[data-order-id]');
    this.orderCard = page.locator('[data-testid="order-card"], .order-card');
    this.orderTable = page.locator('[data-testid="orders-table"], .orders-table');
    
    // Order details
    this.orderId = page.locator('[data-testid="order-id"], .order-id');
    this.orderStatus = page.locator('[data-testid="order-status"], .order-status, .status');
    this.orderDate = page.locator('[data-testid="order-date"], .order-date');
    this.orderTotal = page.locator('[data-testid="order-total"], .order-total, .total');
    this.orderCustomer = page.locator('[data-testid="order-customer"], .order-customer');
    this.orderAddress = page.locator('[data-testid="order-address"], .order-address');
    
    // Create order form
    this.createOrderModal = page.locator('[data-testid="create-order-modal"], .modal:has-text("Create Order")');
    this.customerNameInput = page.locator('input[name="customerName"], input[id="customerName"]');
    this.customerEmailInput = page.locator('input[name="customerEmail"], input[id="customerEmail"]');
    this.customerPhoneInput = page.locator('input[name="customerPhone"], input[id="customerPhone"]');
    this.pickupAddressInput = page.locator('input[name="pickupAddress"], textarea[name="pickupAddress"]');
    this.deliveryAddressInput = page.locator('input[name="deliveryAddress"], textarea[name="deliveryAddress"]');
    this.packageWeightInput = page.locator('input[name="packageWeight"], input[name="weight"]');
    this.packageDimensionsInput = page.locator('input[name="packageDimensions"], input[name="dimensions"]');
    this.priorityDropdown = page.locator('select[name="priority"], select[name="orderPriority"]');
    this.saveOrderButton = page.locator('button:has-text("Save"), button:has-text("Create")');
    this.cancelButton = page.locator('button:has-text("Cancel"), .cancel-button');
    
    // Order actions
    this.viewOrderButton = page.locator('button:has-text("View"), .view-order');
    this.editOrderButton = page.locator('button:has-text("Edit"), .edit-order');
    this.deleteOrderButton = page.locator('button:has-text("Delete"), .delete-order');
    this.trackOrderButton = page.locator('button:has-text("Track"), .track-order');
    this.assignDriverButton = page.locator('button:has-text("Assign Driver"), .assign-driver');
    
    // Status updates
    this.statusDropdown = page.locator('select[name="status"], .status-dropdown');
    this.addNoteButton = page.locator('button:has-text("Add Note"), .add-note');
    this.noteTextarea = page.locator('textarea[name="note"], .note-textarea');
    this.saveNoteButton = page.locator('button:has-text("Save Note"), .save-note');
    
    // Pagination
    this.pagination = page.locator('[data-testid="pagination"], .pagination');
    this.nextPageButton = page.locator('button:has-text("Next"), .next-page');
    this.prevPageButton = page.locator('button:has-text("Previous"), .prev-page');
    this.pageInfo = page.locator('.page-info, .pagination-info');
    
    // Filters
    this.statusFilter = page.locator('select[name="statusFilter"], .status-filter');
    this.dateFilter = page.locator('input[name="dateFilter"], input[type="date"]');
    this.customerFilter = page.locator('input[name="customerFilter"], .customer-filter');
    this.clearFiltersButton = page.locator('button:has-text("Clear Filters"), .clear-filters');
  }

  /**
   * Navigate to orders page
   */
  async goto(): Promise<void> {
    await this.goto('/orders');
  }

  /**
   * Verify orders page is loaded
   */
  async expectOrdersPageLoaded(): Promise<void> {
    await this.expectVisible(this.ordersList);
    await this.expectVisible(this.createOrderButton);
    await this.waitForLoadingToComplete();
  }

  /**
   * Open create order modal
   */
  async openCreateOrderModal(): Promise<void> {
    await this.clickAndWait(this.createOrderButton);
    await this.expectVisible(this.createOrderModal);
  }

  /**
   * Fill order form
   */
  async fillOrderForm(orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    pickupAddress: string;
    deliveryAddress: string;
    packageWeight: string;
    packageDimensions: string;
    priority: string;
  }): Promise<void> {
    await this.fillField(this.customerNameInput, orderData.customerName);
    await this.fillField(this.customerEmailInput, orderData.customerEmail);
    await this.fillField(this.customerPhoneInput, orderData.customerPhone);
    await this.fillField(this.pickupAddressInput, orderData.pickupAddress);
    await this.fillField(this.deliveryAddressInput, orderData.deliveryAddress);
    await this.fillField(this.packageWeightInput, orderData.packageWeight);
    await this.fillField(this.packageDimensionsInput, orderData.packageDimensions);
    await this.selectOption(this.priorityDropdown, orderData.priority);
  }

  /**
   * Submit order form
   */
  async submitOrderForm(): Promise<void> {
    await this.clickAndWait(this.saveOrderButton);
    await this.expectHidden(this.createOrderModal);
    await this.waitForToast('Order created successfully');
  }

  /**
   * Cancel order form
   */
  async cancelOrderForm(): Promise<void> {
    await this.clickAndWait(this.cancelButton);
    await this.expectHidden(this.createOrderModal);
  }

  /**
   * Create a new order
   */
  async createOrder(orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    pickupAddress: string;
    deliveryAddress: string;
    packageWeight: string;
    packageDimensions: string;
    priority: string;
  }): Promise<void> {
    await this.openCreateOrderModal();
    await this.fillOrderForm(orderData);
    await this.submitOrderForm();
  }

  /**
   * Get orders count
   */
  async getOrdersCount(): Promise<number> {
    await this.orderItems.first().waitFor({ state: 'visible' });
    return await this.orderItems.count();
  }

  /**
   * Get order details for specific order
   */
  async getOrderDetails(orderIndex: number = 0): Promise<{
    id: string;
    status: string;
    date: string;
    total: string;
    customer: string;
    address: string;
  }> {
    const orderItem = this.orderItems.nth(orderIndex);
    
    const id = await orderItem.locator(this.orderId).textContent() || '';
    const status = await orderItem.locator(this.orderStatus).textContent() || '';
    const date = await orderItem.locator(this.orderDate).textContent() || '';
    const total = await orderItem.locator(this.orderTotal).textContent() || '';
    const customer = await orderItem.locator(this.orderCustomer).textContent() || '';
    const address = await orderItem.locator(this.orderAddress).textContent() || '';
    
    return { id, status, date, total, customer, address };
  }

  /**
   * Search orders
   */
  async searchOrders(searchTerm: string): Promise<void> {
    await this.fillField(this.searchInput, searchTerm);
    await this.wait(1000); // Wait for search results
  }

  /**
   * Filter orders by status
   */
  async filterByStatus(status: string): Promise<void> {
    await this.selectOption(this.statusFilter, status);
    await this.wait(1000); // Wait for filter to apply
  }

  /**
   * Sort orders
   */
  async sortOrders(sortBy: string): Promise<void> {
    await this.selectOption(this.sortDropdown, sortBy);
    await this.wait(1000); // Wait for sort to apply
  }

  /**
   * Clear all filters
   */
  async clearFilters(): Promise<void> {
    if (await this.clearFiltersButton.isVisible()) {
      await this.clickAndWait(this.clearFiltersButton);
    }
  }

  /**
   * View specific order
   */
  async viewOrder(orderIndex: number = 0): Promise<void> {
    const orderItem = this.orderItems.nth(orderIndex);
    const viewButton = orderItem.locator(this.viewOrderButton);
    await this.clickAndWait(viewButton);
  }

  /**
   * Edit specific order
   */
  async editOrder(orderIndex: number = 0): Promise<void> {
    const orderItem = this.orderItems.nth(orderIndex);
    const editButton = orderItem.locator(this.editOrderButton);
    await this.clickAndWait(editButton);
  }

  /**
   * Delete specific order
   */
  async deleteOrder(orderIndex: number = 0): Promise<void> {
    const orderItem = this.orderItems.nth(orderIndex);
    const deleteButton = orderItem.locator(this.deleteOrderButton);
    await deleteButton.click();
    
    // Handle confirmation dialog if present
    const confirmButton = this.page.locator('button:has-text("Confirm"), button:has-text("Delete")');
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    
    await this.waitForToast('Order deleted successfully');
  }

  /**
   * Track specific order
   */
  async trackOrder(orderIndex: number = 0): Promise<void> {
    const orderItem = this.orderItems.nth(orderIndex);
    const trackButton = orderItem.locator(this.trackOrderButton);
    await this.clickAndWait(trackButton);
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderIndex: number = 0, newStatus: string): Promise<void> {
    const orderItem = this.orderItems.nth(orderIndex);
    const statusDropdown = orderItem.locator(this.statusDropdown);
    await this.selectOption(statusDropdown, newStatus);
    await this.waitForToast('Order status updated');
  }

  /**
   * Add note to order
   */
  async addOrderNote(orderIndex: number = 0, note: string): Promise<void> {
    const orderItem = this.orderItems.nth(orderIndex);
    const addNoteButton = orderItem.locator(this.addNoteButton);
    await addNoteButton.click();
    
    await this.fillField(this.noteTextarea, note);
    await this.clickAndWait(this.saveNoteButton);
    await this.waitForToast('Note added successfully');
  }

  /**
   * Navigate to next page
   */
  async goToNextPage(): Promise<void> {
    if (await this.nextPageButton.isEnabled()) {
      await this.clickAndWait(this.nextPageButton);
    }
  }

  /**
   * Navigate to previous page
   */
  async goToPrevPage(): Promise<void> {
    if (await this.prevPageButton.isEnabled()) {
      await this.clickAndWait(this.prevPageButton);
    }
  }

  /**
   * Get page information
   */
  async getPageInfo(): Promise<string> {
    if (await this.pageInfo.isVisible()) {
      return await this.pageInfo.textContent() || '';
    }
    return '';
  }

  /**
   * Verify order exists in list
   */
  async expectOrderExists(orderId: string): Promise<void> {
    const orderElement = this.page.locator(`[data-order-id="${orderId}"], :has-text("${orderId}")`);
    await this.expectVisible(orderElement);
  }

  /**
   * Verify order status
   */
  async expectOrderStatus(orderIndex: number, expectedStatus: string): Promise<void> {
    const orderItem = this.orderItems.nth(orderIndex);
    const statusElement = orderItem.locator(this.orderStatus);
    await this.expectText(statusElement, expectedStatus);
  }

  /**
   * Test order list responsiveness
   */
  async testResponsiveLayout(): Promise<void> {
    // Test mobile view
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.expectVisible(this.orderCard);
    await this.expectHidden(this.orderTable);
    
    // Test desktop view
    await this.page.setViewportSize({ width: 1200, height: 800 });
    await this.expectVisible(this.orderTable);
  }

  /**
   * Test bulk actions
   */
  async testBulkActions(): Promise<void> {
    const checkboxes = this.page.locator('input[type="checkbox"]');
    if (await checkboxes.count() > 1) {
      await checkboxes.first().check();
      await checkboxes.nth(1).check();
      
      const bulkActions = this.page.locator('.bulk-actions');
      if (await bulkActions.isVisible()) {
        await this.expectVisible(bulkActions);
      }
    }
  }
}
