package xyz.dulli.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import xyz.dulli.domain.BauteilGruppe;

/**
 * Spring Data SQL repository for the BauteilGruppe entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BauteilGruppeRepository extends JpaRepository<BauteilGruppe, Long> {}
