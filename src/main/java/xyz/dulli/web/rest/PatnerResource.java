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
import xyz.dulli.domain.Patner;
import xyz.dulli.repository.PatnerRepository;
import xyz.dulli.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link xyz.dulli.domain.Patner}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PatnerResource {

    private final Logger log = LoggerFactory.getLogger(PatnerResource.class);

    private static final String ENTITY_NAME = "patner";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PatnerRepository patnerRepository;

    public PatnerResource(PatnerRepository patnerRepository) {
        this.patnerRepository = patnerRepository;
    }

    /**
     * {@code POST  /patners} : Create a new patner.
     *
     * @param patner the patner to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new patner, or with status {@code 400 (Bad Request)} if the patner has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/patners")
    public ResponseEntity<Patner> createPatner(@RequestBody Patner patner) throws URISyntaxException {
        log.debug("REST request to save Patner : {}", patner);
        if (patner.getId() != null) {
            throw new BadRequestAlertException("A new patner cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Patner result = patnerRepository.save(patner);
        return ResponseEntity
            .created(new URI("/api/patners/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /patners/:id} : Updates an existing patner.
     *
     * @param id the id of the patner to save.
     * @param patner the patner to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated patner,
     * or with status {@code 400 (Bad Request)} if the patner is not valid,
     * or with status {@code 500 (Internal Server Error)} if the patner couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/patners/{id}")
    public ResponseEntity<Patner> updatePatner(@PathVariable(value = "id", required = false) final Long id, @RequestBody Patner patner)
        throws URISyntaxException {
        log.debug("REST request to update Patner : {}, {}", id, patner);
        if (patner.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, patner.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!patnerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Patner result = patnerRepository.save(patner);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, patner.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /patners/:id} : Partial updates given fields of an existing patner, field will ignore if it is null
     *
     * @param id the id of the patner to save.
     * @param patner the patner to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated patner,
     * or with status {@code 400 (Bad Request)} if the patner is not valid,
     * or with status {@code 404 (Not Found)} if the patner is not found,
     * or with status {@code 500 (Internal Server Error)} if the patner couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/patners/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Patner> partialUpdatePatner(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Patner patner
    ) throws URISyntaxException {
        log.debug("REST request to partial update Patner partially : {}, {}", id, patner);
        if (patner.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, patner.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!patnerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Patner> result = patnerRepository
            .findById(patner.getId())
            .map(existingPatner -> {
                if (patner.getVname() != null) {
                    existingPatner.setVname(patner.getVname());
                }
                if (patner.getName() != null) {
                    existingPatner.setName(patner.getName());
                }

                return existingPatner;
            })
            .map(patnerRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, patner.getId().toString())
        );
    }

    /**
     * {@code GET  /patners} : get all the patners.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of patners in body.
     */
    @GetMapping("/patners")
    public List<Patner> getAllPatners() {
        log.debug("REST request to get all Patners");
        return patnerRepository.findAll();
    }

    /**
     * {@code GET  /patners/:id} : get the "id" patner.
     *
     * @param id the id of the patner to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the patner, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/patners/{id}")
    public ResponseEntity<Patner> getPatner(@PathVariable Long id) {
        log.debug("REST request to get Patner : {}", id);
        Optional<Patner> patner = patnerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(patner);
    }

    /**
     * {@code DELETE  /patners/:id} : delete the "id" patner.
     *
     * @param id the id of the patner to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/patners/{id}")
    public ResponseEntity<Void> deletePatner(@PathVariable Long id) {
        log.debug("REST request to delete Patner : {}", id);
        patnerRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
