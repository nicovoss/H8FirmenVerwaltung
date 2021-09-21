package xyz.dulli.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.dulli.domain.Authority;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
