package com.swiftpulse.notification.controller;

import com.swiftpulse.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications", description = "Email and SMS notification APIs")
public class NotificationController {
    
    private final NotificationService notificationService;
    
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    
    @PostMapping("/email")
    @Operation(summary = "Send email", description = "Sends an email notification")
    public ResponseEntity<String> sendEmail(@RequestParam String to,
                                            @RequestParam String subject,
                                            @RequestParam String body) {
        notificationService.sendEmail(to, subject, body);
        return ResponseEntity.ok("Email sent successfully");
    }
    
    @PostMapping("/sms")
    @Operation(summary = "Send SMS", description = "Sends an SMS notification")
    public ResponseEntity<String> sendSMS(@RequestParam String phoneNumber,
                                          @RequestParam String message) {
        notificationService.sendSMS(phoneNumber, message);
        return ResponseEntity.ok("SMS sent successfully");
    }
}
