package xyz.dulli.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import xyz.dulli.domain.Patner;

/**
 * Spring Data SQL repository for the Patner entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PatnerRepository extends JpaRepository<Patner, Long> {}
