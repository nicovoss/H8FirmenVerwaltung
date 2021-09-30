package xyz.dulli.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import xyz.dulli.domain.BauteileZuRohstoffe;

/**
 * Spring Data SQL repository for the BauteileZuRohstoffe entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BauteileZuRohstoffeRepository extends JpaRepository<BauteileZuRohstoffe, Long> {}
