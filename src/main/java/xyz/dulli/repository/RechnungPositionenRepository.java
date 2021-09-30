package xyz.dulli.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import xyz.dulli.domain.RechnungPositionen;

/**
 * Spring Data SQL repository for the RechnungPositionen entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RechnungPositionenRepository extends JpaRepository<RechnungPositionen, Long> {}
