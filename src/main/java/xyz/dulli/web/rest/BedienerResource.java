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
import xyz.dulli.domain.Bediener;
import xyz.dulli.repository.BedienerRepository;
import xyz.dulli.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link xyz.dulli.domain.Bediener}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BedienerResource {

    private final Logger log = LoggerFactory.getLogger(BedienerResource.class);

    private static final String ENTITY_NAME = "bediener";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BedienerRepository bedienerRepository;

    public BedienerResource(BedienerRepository bedienerRepository) {
        this.bedienerRepository = bedienerRepository;
    }

    /**
     * {@code POST  /bedieners} : Create a new bediener.
     *
     * @param bediener the bediener to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bediener, or with status {@code 400 (Bad Request)} if the bediener has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bedieners")
    public ResponseEntity<Bediener> createBediener(@RequestBody Bediener bediener) throws URISyntaxException {
        log.debug("REST request to save Bediener : {}", bediener);
        if (bediener.getId() != null) {
            throw new BadRequestAlertException("A new bediener cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Bediener result = bedienerRepository.save(bediener);
        return ResponseEntity
            .created(new URI("/api/bedieners/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bedieners/:id} : Updates an existing bediener.
     *
     * @param id the id of the bediener to save.
     * @param bediener the bediener to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bediener,
     * or with status {@code 400 (Bad Request)} if the bediener is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bediener couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bedieners/{id}")
    public ResponseEntity<Bediener> updateBediener(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Bediener bediener
    ) throws URISyntaxException {
        log.debug("REST request to update Bediener : {}, {}", id, bediener);
        if (bediener.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bediener.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bedienerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Bediener result = bedienerRepository.save(bediener);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bediener.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bedieners/:id} : Partial updates given fields of an existing bediener, field will ignore if it is null
     *
     * @param id the id of the bediener to save.
     * @param bediener the bediener to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bediener,
     * or with status {@code 400 (Bad Request)} if the bediener is not valid,
     * or with status {@code 404 (Not Found)} if the bediener is not found,
     * or with status {@code 500 (Internal Server Error)} if the bediener couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bedieners/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Bediener> partialUpdateBediener(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Bediener bediener
    ) throws URISyntaxException {
        log.debug("REST request to partial update Bediener partially : {}, {}", id, bediener);
        if (bediener.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bediener.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bedienerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Bediener> result = bedienerRepository
            .findById(bediener.getId())
            .map(existingBediener -> {
                if (bediener.getVname() != null) {
                    existingBediener.setVname(bediener.getVname());
                }
                if (bediener.getName() != null) {
                    existingBediener.setName(bediener.getName());
                }

                return existingBediener;
            })
            .map(bedienerRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bediener.getId().toString())
        );
    }

    /**
     * {@code GET  /bedieners} : get all the bedieners.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bedieners in body.
     */
    @GetMapping("/bedieners")
    public List<Bediener> getAllBedieners() {
        log.debug("REST request to get all Bedieners");
        return bedienerRepository.findAll();
    }

    /**
     * {@code GET  /bedieners/:id} : get the "id" bediener.
     *
     * @param id the id of the bediener to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bediener, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bedieners/{id}")
    public ResponseEntity<Bediener> getBediener(@PathVariable Long id) {
        log.debug("REST request to get Bediener : {}", id);
        Optional<Bediener> bediener = bedienerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bediener);
    }

    /**
     * {@code DELETE  /bedieners/:id} : delete the "id" bediener.
     *
     * @param id the id of the bediener to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bedieners/{id}")
    public ResponseEntity<Void> deleteBediener(@PathVariable Long id) {
        log.debug("REST request to delete Bediener : {}", id);
        bedienerRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
