package xyz.dulli.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import xyz.dulli.domain.AuftragPositionen;

/**
 * Spring Data SQL repository for the AuftragPositionen entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AuftragPositionenRepository extends JpaRepository<AuftragPositionen, Long> {}
