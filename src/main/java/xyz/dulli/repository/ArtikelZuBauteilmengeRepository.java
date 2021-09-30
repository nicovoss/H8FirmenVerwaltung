package xyz.dulli.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import xyz.dulli.domain.ArtikelZuBauteilmenge;

/**
 * Spring Data SQL repository for the ArtikelZuBauteilmenge entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ArtikelZuBauteilmengeRepository extends JpaRepository<ArtikelZuBauteilmenge, Long> {}
