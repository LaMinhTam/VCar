package vn.edu.iuh.sv.vcarbe.repository;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.entity.Notification;

public interface NotificationRepository extends ReactiveMongoRepository<Notification, ObjectId> {
    Flux<Notification> findByUserIdOrderByCreatedAtDesc(ObjectId userId);

    Flux<Notification> findByUserId(ObjectId userId, Pageable pageable);

    Mono<Long> countByUserId(ObjectId userId);
}
