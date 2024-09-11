package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.NotificationDTO;

public interface NotificationService {
    Flux<NotificationDTO> getNotificationsForUser(ObjectId userId);
    Mono<NotificationDTO> markAsRead(ObjectId notificationId);
}
