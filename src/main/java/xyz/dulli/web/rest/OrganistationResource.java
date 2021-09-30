package xyz.dulli.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import xyz.dulli.domain.Organistation;
import xyz.dulli.repository.OrganistationRepository;
import xyz.dulli.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link xyz.dulli.domain.Organistation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OrganistationResource {

    private final Logger log = LoggerFactory.getLogger(OrganistationResource.class);

    private static final String ENTITY_NAME = "organistation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrganistationRepository organistationRepository;

    public OrganistationResource(OrganistationRepository organistationRepository) {
        this.organistationRepository = organistationRepository;
    }

    /**
     * {@code POST  /organistations} : Create a new organistation.
     *
     * @param organistation the organistation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new organistation, or with status {@code 400 (Bad Request)} if the organistation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/organistations")
    public ResponseEntity<Organistation> createOrganistation(@Valid @RequestBody Organistation organistation) throws URISyntaxException {
        log.debug("REST request to save Organistation : {}", organistation);
        if (organistation.getId() != null) {
            throw new BadRequestAlertException("A new organistation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Organistation result = organistationRepository.save(organistation);
        return ResponseEntity
            .created(new URI("/api/organistations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /organistations/:id} : Updates an existing organistation.
     *
     * @param id the id of the organistation to save.
     * @param organistation the organistation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated organistation,
     * or with status {@code 400 (Bad Request)} if the organistation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the organistation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/organistations/{id}")
    public ResponseEntity<Organistation> updateOrganistation(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Organistation organistation
    ) throws URISyntaxException {
        log.debug("REST request to update Organistation : {}, {}", id, organistation);
        if (organistation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, organistation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!organistationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Organistation result = organistationRepository.save(organistation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, organistation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /organistations/:id} : Partial updates given fields of an existing organistation, field will ignore if it is null
     *
     * @param id the id of the organistation to save.
     * @param organistation the organistation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated organistation,
     * or with status {@code 400 (Bad Request)} if the organistation is not valid,
     * or with status {@code 404 (Not Found)} if the organistation is not found,
     * or with status {@code 500 (Internal Server Error)} if the organistation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/organistations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Organistation> partialUpdateOrganistation(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Organistation organistation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Organistation partially : {}, {}", id, organistation);
        if (organistation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, organistation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!organistationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Organistation> result = organistationRepository
            .findById(organistation.getId())
            .map(existingOrganistation -> {
                if (organistation.getOrgaId() != null) {
                    existingOrganistation.setOrgaId(organistation.getOrgaId());
                }
                if (organistation.getName() != null) {
                    existingOrganistation.setName(organistation.getName());
                }

                return existingOrganistation;
            })
            .map(organistationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, organistation.getId().toString())
        );
    }

    /**
     * {@code GET  /organistations} : get all the organistations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of organistations in body.
     */
    @GetMapping("/organistations")
    public List<Organistation> getAllOrganistations() {
        log.debug("REST request to get all Organistations");
        return organistationRepository.findAll();
    }

    /**
     * {@code GET  /organistations/:id} : get the "id" organistation.
     *
     * @param id the id of the organistation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the organistation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/organistations/{id}")
    public ResponseEntity<Organistation> getOrganistation(@PathVariable Long id) {
        log.debug("REST request to get Organistation : {}", id);
        Optional<Organistation> organistation = organistationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(organistation);
    }

    /**
     * {@code DELETE  /organistations/:id} : delete the "id" organistation.
     *
     * @param id the id of the organistation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/organistations/{id}")
    public ResponseEntity<Void> deleteOrganistation(@PathVariable Long id) {
        log.debug("REST request to delete Organistation : {}", id);
        organistationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
