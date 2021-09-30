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
import xyz.dulli.domain.Bauteil;
import xyz.dulli.repository.BauteilRepository;
import xyz.dulli.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link xyz.dulli.domain.Bauteil}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BauteilResource {

    private final Logger log = LoggerFactory.getLogger(BauteilResource.class);

    private static final String ENTITY_NAME = "bauteil";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BauteilRepository bauteilRepository;

    public BauteilResource(BauteilRepository bauteilRepository) {
        this.bauteilRepository = bauteilRepository;
    }

    /**
     * {@code POST  /bauteils} : Create a new bauteil.
     *
     * @param bauteil the bauteil to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bauteil, or with status {@code 400 (Bad Request)} if the bauteil has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bauteils")
    public ResponseEntity<Bauteil> createBauteil(@RequestBody Bauteil bauteil) throws URISyntaxException {
        log.debug("REST request to save Bauteil : {}", bauteil);
        if (bauteil.getId() != null) {
            throw new BadRequestAlertException("A new bauteil cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Bauteil result = bauteilRepository.save(bauteil);
        return ResponseEntity
            .created(new URI("/api/bauteils/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bauteils/:id} : Updates an existing bauteil.
     *
     * @param id the id of the bauteil to save.
     * @param bauteil the bauteil to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bauteil,
     * or with status {@code 400 (Bad Request)} if the bauteil is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bauteil couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bauteils/{id}")
    public ResponseEntity<Bauteil> updateBauteil(@PathVariable(value = "id", required = false) final Long id, @RequestBody Bauteil bauteil)
        throws URISyntaxException {
        log.debug("REST request to update Bauteil : {}, {}", id, bauteil);
        if (bauteil.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bauteil.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bauteilRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Bauteil result = bauteilRepository.save(bauteil);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bauteil.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bauteils/:id} : Partial updates given fields of an existing bauteil, field will ignore if it is null
     *
     * @param id the id of the bauteil to save.
     * @param bauteil the bauteil to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bauteil,
     * or with status {@code 400 (Bad Request)} if the bauteil is not valid,
     * or with status {@code 404 (Not Found)} if the bauteil is not found,
     * or with status {@code 500 (Internal Server Error)} if the bauteil couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bauteils/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Bauteil> partialUpdateBauteil(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Bauteil bauteil
    ) throws URISyntaxException {
        log.debug("REST request to partial update Bauteil partially : {}, {}", id, bauteil);
        if (bauteil.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bauteil.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bauteilRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Bauteil> result = bauteilRepository
            .findById(bauteil.getId())
            .map(existingBauteil -> {
                if (bauteil.getName() != null) {
                    existingBauteil.setName(bauteil.getName());
                }

                return existingBauteil;
            })
            .map(bauteilRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bauteil.getId().toString())
        );
    }

    /**
     * {@code GET  /bauteils} : get all the bauteils.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bauteils in body.
     */
    @GetMapping("/bauteils")
    public List<Bauteil> getAllBauteils() {
        log.debug("REST request to get all Bauteils");
        return bauteilRepository.findAll();
    }

    /**
     * {@code GET  /bauteils/:id} : get the "id" bauteil.
     *
     * @param id the id of the bauteil to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bauteil, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bauteils/{id}")
    public ResponseEntity<Bauteil> getBauteil(@PathVariable Long id) {
        log.debug("REST request to get Bauteil : {}", id);
        Optional<Bauteil> bauteil = bauteilRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bauteil);
    }

    /**
     * {@code DELETE  /bauteils/:id} : delete the "id" bauteil.
     *
     * @param id the id of the bauteil to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bauteils/{id}")
    public ResponseEntity<Void> deleteBauteil(@PathVariable Long id) {
        log.debug("REST request to delete Bauteil : {}", id);
        bauteilRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
