package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import vn.edu.iuh.sv.vcarbe.entity.Notification;
import vn.edu.iuh.sv.vcarbe.entity.NotificationType;

import java.util.List;

public interface NotificationService {
    List<Notification> getNotificationsForUser(ObjectId userId);
    void markAsRead(ObjectId notificationId);
}
