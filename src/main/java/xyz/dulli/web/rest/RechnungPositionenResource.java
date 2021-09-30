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
import xyz.dulli.domain.RechnungPositionen;
import xyz.dulli.repository.RechnungPositionenRepository;
import xyz.dulli.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link xyz.dulli.domain.RechnungPositionen}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RechnungPositionenResource {

    private final Logger log = LoggerFactory.getLogger(RechnungPositionenResource.class);

    private static final String ENTITY_NAME = "rechnungPositionen";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RechnungPositionenRepository rechnungPositionenRepository;

    public RechnungPositionenResource(RechnungPositionenRepository rechnungPositionenRepository) {
        this.rechnungPositionenRepository = rechnungPositionenRepository;
    }

    /**
     * {@code POST  /rechnung-positionens} : Create a new rechnungPositionen.
     *
     * @param rechnungPositionen the rechnungPositionen to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rechnungPositionen, or with status {@code 400 (Bad Request)} if the rechnungPositionen has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/rechnung-positionens")
    public ResponseEntity<RechnungPositionen> createRechnungPositionen(@Valid @RequestBody RechnungPositionen rechnungPositionen)
        throws URISyntaxException {
        log.debug("REST request to save RechnungPositionen : {}", rechnungPositionen);
        if (rechnungPositionen.getId() != null) {
            throw new BadRequestAlertException("A new rechnungPositionen cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RechnungPositionen result = rechnungPositionenRepository.save(rechnungPositionen);
        return ResponseEntity
            .created(new URI("/api/rechnung-positionens/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /rechnung-positionens/:id} : Updates an existing rechnungPositionen.
     *
     * @param id the id of the rechnungPositionen to save.
     * @param rechnungPositionen the rechnungPositionen to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rechnungPositionen,
     * or with status {@code 400 (Bad Request)} if the rechnungPositionen is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rechnungPositionen couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/rechnung-positionens/{id}")
    public ResponseEntity<RechnungPositionen> updateRechnungPositionen(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody RechnungPositionen rechnungPositionen
    ) throws URISyntaxException {
        log.debug("REST request to update RechnungPositionen : {}, {}", id, rechnungPositionen);
        if (rechnungPositionen.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rechnungPositionen.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rechnungPositionenRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RechnungPositionen result = rechnungPositionenRepository.save(rechnungPositionen);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rechnungPositionen.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /rechnung-positionens/:id} : Partial updates given fields of an existing rechnungPositionen, field will ignore if it is null
     *
     * @param id the id of the rechnungPositionen to save.
     * @param rechnungPositionen the rechnungPositionen to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rechnungPositionen,
     * or with status {@code 400 (Bad Request)} if the rechnungPositionen is not valid,
     * or with status {@code 404 (Not Found)} if the rechnungPositionen is not found,
     * or with status {@code 500 (Internal Server Error)} if the rechnungPositionen couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/rechnung-positionens/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RechnungPositionen> partialUpdateRechnungPositionen(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody RechnungPositionen rechnungPositionen
    ) throws URISyntaxException {
        log.debug("REST request to partial update RechnungPositionen partially : {}, {}", id, rechnungPositionen);
        if (rechnungPositionen.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rechnungPositionen.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rechnungPositionenRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RechnungPositionen> result = rechnungPositionenRepository
            .findById(rechnungPositionen.getId())
            .map(existingRechnungPositionen -> {
                if (rechnungPositionen.getArtikelName() != null) {
                    existingRechnungPositionen.setArtikelName(rechnungPositionen.getArtikelName());
                }
                if (rechnungPositionen.getArtikelBeschreibung() != null) {
                    existingRechnungPositionen.setArtikelBeschreibung(rechnungPositionen.getArtikelBeschreibung());
                }
                if (rechnungPositionen.getArtikelPreis() != null) {
                    existingRechnungPositionen.setArtikelPreis(rechnungPositionen.getArtikelPreis());
                }
                if (rechnungPositionen.getMenge() != null) {
                    existingRechnungPositionen.setMenge(rechnungPositionen.getMenge());
                }

                return existingRechnungPositionen;
            })
            .map(rechnungPositionenRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rechnungPositionen.getId().toString())
        );
    }

    /**
     * {@code GET  /rechnung-positionens} : get all the rechnungPositionens.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rechnungPositionens in body.
     */
    @GetMapping("/rechnung-positionens")
    public List<RechnungPositionen> getAllRechnungPositionens() {
        log.debug("REST request to get all RechnungPositionens");
        return rechnungPositionenRepository.findAll();
    }

    /**
     * {@code GET  /rechnung-positionens/:id} : get the "id" rechnungPositionen.
     *
     * @param id the id of the rechnungPositionen to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rechnungPositionen, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/rechnung-positionens/{id}")
    public ResponseEntity<RechnungPositionen> getRechnungPositionen(@PathVariable Long id) {
        log.debug("REST request to get RechnungPositionen : {}", id);
        Optional<RechnungPositionen> rechnungPositionen = rechnungPositionenRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(rechnungPositionen);
    }

    /**
     * {@code DELETE  /rechnung-positionens/:id} : delete the "id" rechnungPositionen.
     *
     * @param id the id of the rechnungPositionen to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/rechnung-positionens/{id}")
    public ResponseEntity<Void> deleteRechnungPositionen(@PathVariable Long id) {
        log.debug("REST request to delete RechnungPositionen : {}", id);
        rechnungPositionenRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
