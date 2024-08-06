package vn.edu.iuh.sv.vcarbe.controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.sv.vcarbe.dto.ApiResponse;
import vn.edu.iuh.sv.vcarbe.entity.Notification;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse> getNotifications(@CurrentUser UserPrincipal userPrincipal) {
        List<Notification> notifications = notificationService.getNotificationsForUser(userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse(200, "success", notifications));
    }

    @PutMapping("/{id}/markAsRead")
    public ResponseEntity<ApiResponse> markAsRead(@PathVariable ObjectId id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(new ApiResponse(200, "Notification marked as read", null));
    }
}
