package xyz.dulli.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import xyz.dulli.domain.Organistation;

/**
 * Spring Data SQL repository for the Organistation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrganistationRepository extends JpaRepository<Organistation, Long> {}
