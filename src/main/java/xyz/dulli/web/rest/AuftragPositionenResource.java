package xyz.dulli.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import xyz.dulli.domain.AuftragPositionen;
import xyz.dulli.repository.AuftragPositionenRepository;
import xyz.dulli.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link xyz.dulli.domain.AuftragPositionen}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AuftragPositionenResource {

    private final Logger log = LoggerFactory.getLogger(AuftragPositionenResource.class);

    private static final String ENTITY_NAME = "auftragPositionen";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AuftragPositionenRepository auftragPositionenRepository;

    public AuftragPositionenResource(AuftragPositionenRepository auftragPositionenRepository) {
        this.auftragPositionenRepository = auftragPositionenRepository;
    }

    /**
     * {@code POST  /auftrag-positionens} : Create a new auftragPositionen.
     *
     * @param auftragPositionen the auftragPositionen to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new auftragPositionen, or with status {@code 400 (Bad Request)} if the auftragPositionen has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/auftrag-positionens")
    public ResponseEntity<AuftragPositionen> createAuftragPositionen(@RequestBody AuftragPositionen auftragPositionen)
        throws URISyntaxException {
        log.debug("REST request to save AuftragPositionen : {}", auftragPositionen);
        if (auftragPositionen.getId() != null) {
            throw new BadRequestAlertException("A new auftragPositionen cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AuftragPositionen result = auftragPositionenRepository.save(auftragPositionen);
        return ResponseEntity
            .created(new URI("/api/auftrag-positionens/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /auftrag-positionens/:id} : Updates an existing auftragPositionen.
     *
     * @param id the id of the auftragPositionen to save.
     * @param auftragPositionen the auftragPositionen to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated auftragPositionen,
     * or with status {@code 400 (Bad Request)} if the auftragPositionen is not valid,
     * or with status {@code 500 (Internal Server Error)} if the auftragPositionen couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/auftrag-positionens/{id}")
    public ResponseEntity<AuftragPositionen> updateAuftragPositionen(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AuftragPositionen auftragPositionen
    ) throws URISyntaxException {
        log.debug("REST request to update AuftragPositionen : {}, {}", id, auftragPositionen);
        if (auftragPositionen.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, auftragPositionen.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!auftragPositionenRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AuftragPositionen result = auftragPositionenRepository.save(auftragPositionen);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, auftragPositionen.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /auftrag-positionens/:id} : Partial updates given fields of an existing auftragPositionen, field will ignore if it is null
     *
     * @param id the id of the auftragPositionen to save.
     * @param auftragPositionen the auftragPositionen to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated auftragPositionen,
     * or with status {@code 400 (Bad Request)} if the auftragPositionen is not valid,
     * or with status {@code 404 (Not Found)} if the auftragPositionen is not found,
     * or with status {@code 500 (Internal Server Error)} if the auftragPositionen couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/auftrag-positionens/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AuftragPositionen> partialUpdateAuftragPositionen(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AuftragPositionen auftragPositionen
    ) throws URISyntaxException {
        log.debug("REST request to partial update AuftragPositionen partially : {}, {}", id, auftragPositionen);
        if (auftragPositionen.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, auftragPositionen.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!auftragPositionenRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AuftragPositionen> result = auftragPositionenRepository
            .findById(auftragPositionen.getId())
            .map(existingAuftragPositionen -> {
                if (auftragPositionen.getMenge() != null) {
                    existingAuftragPositionen.setMenge(auftragPositionen.getMenge());
                }

                return existingAuftragPositionen;
            })
            .map(auftragPositionenRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, auftragPositionen.getId().toString())
        );
    }

    /**
     * {@code GET  /auftrag-positionens} : get all the auftragPositionens.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of auftragPositionens in body.
     */
    @GetMapping("/auftrag-positionens")
    public List<AuftragPositionen> getAllAuftragPositionens() {
        log.debug("REST request to get all AuftragPositionens");
        return auftragPositionenRepository.findAll();
    }

    /**
     * {@code GET  /auftrag-positionens/:id} : get the "id" auftragPositionen.
     *
     * @param id the id of the auftragPositionen to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the auftragPositionen, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/auftrag-positionens/{id}")
    public ResponseEntity<AuftragPositionen> getAuftragPositionen(@PathVariable Long id) {
        log.debug("REST request to get AuftragPositionen : {}", id);
        Optional<AuftragPositionen> auftragPositionen = auftragPositionenRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(auftragPositionen);
    }

    /**
     * {@code DELETE  /auftrag-positionens/:id} : delete the "id" auftragPositionen.
     *
     * @param id the id of the auftragPositionen to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/auftrag-positionens/{id}")
    public ResponseEntity<Void> deleteAuftragPositionen(@PathVariable Long id) {
        log.debug("REST request to delete AuftragPositionen : {}", id);
        auftragPositionenRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
