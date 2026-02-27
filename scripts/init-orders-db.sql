-- Initialize Order Service Database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    weight DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    package_type VARCHAR(20) NOT NULL,
    delivery_type VARCHAR(20) NOT NULL,
    pickup_address_street VARCHAR(255) NOT NULL,
    pickup_address_city VARCHAR(100) NOT NULL,
    pickup_address_state VARCHAR(100) NOT NULL,
    pickup_address_zip_code VARCHAR(20) NOT NULL,
    pickup_address_country VARCHAR(100) NOT NULL,
    pickup_address_latitude DECIMAL(10,8),
    pickup_address_longitude DECIMAL(11,8),
    delivery_address_street VARCHAR(255) NOT NULL,
    delivery_address_city VARCHAR(100) NOT NULL,
    delivery_address_state VARCHAR(100) NOT NULL,
    delivery_address_zip_code VARCHAR(20) NOT NULL,
    delivery_address_country VARCHAR(100) NOT NULL,
    delivery_address_latitude DECIMAL(10,8),
    delivery_address_longitude DECIMAL(11,8),
    priority_level VARCHAR(20) NOT NULL,
    estimated_cost DECIMAL(10,2),
    estimated_delivery_date TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    tracking_number VARCHAR(100),
    assigned_driver_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_assigned_driver_id ON orders(assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
