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
import xyz.dulli.domain.RechnungKopf;
import xyz.dulli.repository.RechnungKopfRepository;
import xyz.dulli.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link xyz.dulli.domain.RechnungKopf}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RechnungKopfResource {

    private final Logger log = LoggerFactory.getLogger(RechnungKopfResource.class);

    private static final String ENTITY_NAME = "rechnungKopf";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RechnungKopfRepository rechnungKopfRepository;

    public RechnungKopfResource(RechnungKopfRepository rechnungKopfRepository) {
        this.rechnungKopfRepository = rechnungKopfRepository;
    }

    /**
     * {@code POST  /rechnung-kopfs} : Create a new rechnungKopf.
     *
     * @param rechnungKopf the rechnungKopf to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rechnungKopf, or with status {@code 400 (Bad Request)} if the rechnungKopf has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/rechnung-kopfs")
    public ResponseEntity<RechnungKopf> createRechnungKopf(@RequestBody RechnungKopf rechnungKopf) throws URISyntaxException {
        log.debug("REST request to save RechnungKopf : {}", rechnungKopf);
        if (rechnungKopf.getId() != null) {
            throw new BadRequestAlertException("A new rechnungKopf cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RechnungKopf result = rechnungKopfRepository.save(rechnungKopf);
        return ResponseEntity
            .created(new URI("/api/rechnung-kopfs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /rechnung-kopfs/:id} : Updates an existing rechnungKopf.
     *
     * @param id the id of the rechnungKopf to save.
     * @param rechnungKopf the rechnungKopf to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rechnungKopf,
     * or with status {@code 400 (Bad Request)} if the rechnungKopf is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rechnungKopf couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/rechnung-kopfs/{id}")
    public ResponseEntity<RechnungKopf> updateRechnungKopf(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RechnungKopf rechnungKopf
    ) throws URISyntaxException {
        log.debug("REST request to update RechnungKopf : {}, {}", id, rechnungKopf);
        if (rechnungKopf.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rechnungKopf.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rechnungKopfRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RechnungKopf result = rechnungKopfRepository.save(rechnungKopf);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rechnungKopf.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /rechnung-kopfs/:id} : Partial updates given fields of an existing rechnungKopf, field will ignore if it is null
     *
     * @param id the id of the rechnungKopf to save.
     * @param rechnungKopf the rechnungKopf to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rechnungKopf,
     * or with status {@code 400 (Bad Request)} if the rechnungKopf is not valid,
     * or with status {@code 404 (Not Found)} if the rechnungKopf is not found,
     * or with status {@code 500 (Internal Server Error)} if the rechnungKopf couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/rechnung-kopfs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RechnungKopf> partialUpdateRechnungKopf(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RechnungKopf rechnungKopf
    ) throws URISyntaxException {
        log.debug("REST request to partial update RechnungKopf partially : {}, {}", id, rechnungKopf);
        if (rechnungKopf.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rechnungKopf.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rechnungKopfRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RechnungKopf> result = rechnungKopfRepository
            .findById(rechnungKopf.getId())
            .map(existingRechnungKopf -> {
                return existingRechnungKopf;
            })
            .map(rechnungKopfRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rechnungKopf.getId().toString())
        );
    }

    /**
     * {@code GET  /rechnung-kopfs} : get all the rechnungKopfs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rechnungKopfs in body.
     */
    @GetMapping("/rechnung-kopfs")
    public List<RechnungKopf> getAllRechnungKopfs() {
        log.debug("REST request to get all RechnungKopfs");
        return rechnungKopfRepository.findAll();
    }

    /**
     * {@code GET  /rechnung-kopfs/:id} : get the "id" rechnungKopf.
     *
     * @param id the id of the rechnungKopf to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rechnungKopf, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/rechnung-kopfs/{id}")
    public ResponseEntity<RechnungKopf> getRechnungKopf(@PathVariable Long id) {
        log.debug("REST request to get RechnungKopf : {}", id);
        Optional<RechnungKopf> rechnungKopf = rechnungKopfRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(rechnungKopf);
    }

    /**
     * {@code DELETE  /rechnung-kopfs/:id} : delete the "id" rechnungKopf.
     *
     * @param id the id of the rechnungKopf to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/rechnung-kopfs/{id}")
    public ResponseEntity<Void> deleteRechnungKopf(@PathVariable Long id) {
        log.debug("REST request to delete RechnungKopf : {}", id);
        rechnungKopfRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
