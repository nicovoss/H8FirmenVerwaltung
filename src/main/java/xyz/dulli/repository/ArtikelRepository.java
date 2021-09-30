package xyz.dulli.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import xyz.dulli.domain.Artikel;

/**
 * Spring Data SQL repository for the Artikel entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ArtikelRepository extends JpaRepository<Artikel, Long> {}
