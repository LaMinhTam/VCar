package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.NotificationDTO;
import vn.edu.iuh.sv.vcarbe.repository.NotificationRepository;
import vn.edu.iuh.sv.vcarbe.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public Flux<NotificationDTO> getNotificationsForUser(ObjectId userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .map(notification -> modelMapper.map(notification, NotificationDTO.class));
    }

    @Override
    public Mono<NotificationDTO> markAsRead(ObjectId notificationId) {
        return notificationRepository.findById(notificationId)
                .switchIfEmpty(Mono.error(new RuntimeException("Notification not found with id " + notificationId)))
                .flatMap(notification -> {
                    notification.setRead(true);
                    return notificationRepository.save(notification);
                }).map(notification -> modelMapper.map(notification, NotificationDTO.class));
    }
}
