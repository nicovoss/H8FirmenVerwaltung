package xyz.dulli.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import xyz.dulli.domain.Rohstoff;

/**
 * Spring Data SQL repository for the Rohstoff entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RohstoffRepository extends JpaRepository<Rohstoff, Long> {}
