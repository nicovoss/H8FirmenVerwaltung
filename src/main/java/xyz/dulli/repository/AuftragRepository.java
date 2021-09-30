package xyz.dulli.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import xyz.dulli.domain.Auftrag;

/**
 * Spring Data SQL repository for the Auftrag entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AuftragRepository extends JpaRepository<Auftrag, Long> {}
