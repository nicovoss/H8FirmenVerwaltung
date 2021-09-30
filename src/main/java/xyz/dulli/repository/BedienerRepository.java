package xyz.dulli.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import xyz.dulli.domain.Bediener;

/**
 * Spring Data SQL repository for the Bediener entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BedienerRepository extends JpaRepository<Bediener, Long> {}
