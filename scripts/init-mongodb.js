// Initialize MongoDB for Tracking Service
db = db.getSiblingDB('swiftpulse_tracking');

// Create collections
db.createCollection('tracking_updates');
db.createCollection('delivery_sessions');

// Create indexes for tracking_updates
db.tracking_updates.createIndex({ "orderId": 1 });
db.tracking_updates.createIndex({ "trackingNumber": 1 });
db.tracking_updates.createIndex({ "timestamp": 1 });
db.tracking_updates.createIndex({ "driverId": 1 });
db.tracking_updates.createIndex({ "status": 1 });
db.tracking_updates.createIndex({ "location": "2dsphere" });

// Create indexes for delivery_sessions
db.delivery_sessions.createIndex({ "orderId": 1 });
db.tracking_updates.createIndex({ "driverId": 1 });
db.delivery_sessions.createIndex({ "sessionId": 1 });
db.delivery_sessions.createIndex({ "startTime": 1 });

// Insert sample data
db.tracking_updates.insertOne({
    "orderId": 1,
    "trackingNumber": "SP1000001",
    "location": {
        "type": "Point",
        "coordinates": [-74.0060, 40.7128]
    },
    "latitude": 40.7128,
    "longitude": -74.0060,
    "locationDescription": "New York, NY",
    "status": "PENDING",
    "notes": "Order created",
    "timestamp": new Date(),
    "driverId": null,
    "driverName": null,
    "speed": null,
    "heading": null,
    "accuracy": null
});

print("MongoDB initialization completed successfully");
