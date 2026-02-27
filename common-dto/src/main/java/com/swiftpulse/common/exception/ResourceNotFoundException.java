package com.swiftpulse.common.exception;

public class ResourceNotFoundException extends RuntimeException {
    private final String resourceName;
    private final Object resourceValue;

    public ResourceNotFoundException(String resourceName, Object resourceValue) {
        super(String.format("%s not found with %s : '%s'", resourceName, 
            resourceValue instanceof Long ? "id" : "value", resourceValue));
        this.resourceName = resourceName;
        this.resourceValue = resourceValue;
    }

    public String getResourceName() {
        return resourceName;
    }

    public Object getResourceValue() {
        return resourceValue;
    }
}
