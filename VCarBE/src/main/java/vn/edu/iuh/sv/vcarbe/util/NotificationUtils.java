package vn.edu.iuh.sv.vcarbe.util;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import vn.edu.iuh.sv.vcarbe.entity.Notification;
import vn.edu.iuh.sv.vcarbe.entity.NotificationType;
import vn.edu.iuh.sv.vcarbe.repository.NotificationRepository;

import java.util.Date;

@Component
public class NotificationUtils {

    @Autowired
    private NotificationRepository notificationRepository;

    public void createNotification(ObjectId userId, String message, NotificationType type, String link, ObjectId targetId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setType(type);
        notification.setLink(link);
        notification.setRead(false);
        notification.setCreatedAt(new Date());
        notification.setTargetId(targetId);
        notificationRepository.save(notification);
    }
}
