package xyz.dulli.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import xyz.dulli.domain.Bauteil;

/**
 * Spring Data SQL repository for the Bauteil entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BauteilRepository extends JpaRepository<Bauteil, Long> {}
