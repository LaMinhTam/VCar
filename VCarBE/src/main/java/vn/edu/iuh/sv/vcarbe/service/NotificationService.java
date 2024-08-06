package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import vn.edu.iuh.sv.vcarbe.entity.Notification;
import vn.edu.iuh.sv.vcarbe.entity.NotificationType;

import java.util.List;

public interface NotificationService {
    List<Notification> getNotificationsForUser(ObjectId userId);
    Notification createNotification(String userId, String message, NotificationType type, String link);
    void markAsRead(ObjectId notificationId);
}
