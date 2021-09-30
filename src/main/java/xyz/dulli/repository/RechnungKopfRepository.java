package xyz.dulli.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import xyz.dulli.domain.RechnungKopf;

/**
 * Spring Data SQL repository for the RechnungKopf entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RechnungKopfRepository extends JpaRepository<RechnungKopf, Long> {}
