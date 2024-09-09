package vn.edu.iuh.sv.vcarbe.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.sv.vcarbe.dto.ApiResponseWrapper;
import vn.edu.iuh.sv.vcarbe.entity.Notification;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @Operation(summary = "Retrieve notifications for the current user",
            description = "Fetches all notifications for the currently authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notifications retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
    @GetMapping
    public ResponseEntity<ApiResponseWrapper> getNotifications(
            @CurrentUser @Parameter(hidden = true) UserPrincipal userPrincipal) {
        List<Notification> notifications = notificationService.getNotificationsForUser(userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponseWrapper(200, "Notifications retrieved successfully", notifications));
    }

    @Operation(summary = "Mark a notification as read",
            description = "Updates the status of a specific notification to 'read'.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification marked as read"),
            @ApiResponse(responseCode = "404", description = "Notification not found")
    })
    @PutMapping("/{id}/markAsRead")
    public ResponseEntity<ApiResponseWrapper> markAsRead(
            @PathVariable
            @Parameter(
                    description = "ID of the notification to mark as read",
                    schema = @Schema(type = "string")
            )
            ObjectId id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(new ApiResponseWrapper(200, "Notification marked as read", null));
    }
}
