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
import xyz.dulli.domain.Rohstoff;
import xyz.dulli.repository.RohstoffRepository;
import xyz.dulli.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link xyz.dulli.domain.Rohstoff}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RohstoffResource {

    private final Logger log = LoggerFactory.getLogger(RohstoffResource.class);

    private static final String ENTITY_NAME = "rohstoff";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RohstoffRepository rohstoffRepository;

    public RohstoffResource(RohstoffRepository rohstoffRepository) {
        this.rohstoffRepository = rohstoffRepository;
    }

    /**
     * {@code POST  /rohstoffs} : Create a new rohstoff.
     *
     * @param rohstoff the rohstoff to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rohstoff, or with status {@code 400 (Bad Request)} if the rohstoff has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/rohstoffs")
    public ResponseEntity<Rohstoff> createRohstoff(@RequestBody Rohstoff rohstoff) throws URISyntaxException {
        log.debug("REST request to save Rohstoff : {}", rohstoff);
        if (rohstoff.getId() != null) {
            throw new BadRequestAlertException("A new rohstoff cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Rohstoff result = rohstoffRepository.save(rohstoff);
        return ResponseEntity
            .created(new URI("/api/rohstoffs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /rohstoffs/:id} : Updates an existing rohstoff.
     *
     * @param id the id of the rohstoff to save.
     * @param rohstoff the rohstoff to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rohstoff,
     * or with status {@code 400 (Bad Request)} if the rohstoff is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rohstoff couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/rohstoffs/{id}")
    public ResponseEntity<Rohstoff> updateRohstoff(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Rohstoff rohstoff
    ) throws URISyntaxException {
        log.debug("REST request to update Rohstoff : {}, {}", id, rohstoff);
        if (rohstoff.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rohstoff.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rohstoffRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Rohstoff result = rohstoffRepository.save(rohstoff);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rohstoff.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /rohstoffs/:id} : Partial updates given fields of an existing rohstoff, field will ignore if it is null
     *
     * @param id the id of the rohstoff to save.
     * @param rohstoff the rohstoff to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rohstoff,
     * or with status {@code 400 (Bad Request)} if the rohstoff is not valid,
     * or with status {@code 404 (Not Found)} if the rohstoff is not found,
     * or with status {@code 500 (Internal Server Error)} if the rohstoff couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/rohstoffs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Rohstoff> partialUpdateRohstoff(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Rohstoff rohstoff
    ) throws URISyntaxException {
        log.debug("REST request to partial update Rohstoff partially : {}, {}", id, rohstoff);
        if (rohstoff.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rohstoff.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rohstoffRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Rohstoff> result = rohstoffRepository
            .findById(rohstoff.getId())
            .map(existingRohstoff -> {
                if (rohstoff.getName() != null) {
                    existingRohstoff.setName(rohstoff.getName());
                }
                if (rohstoff.getPreis() != null) {
                    existingRohstoff.setPreis(rohstoff.getPreis());
                }

                return existingRohstoff;
            })
            .map(rohstoffRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rohstoff.getId().toString())
        );
    }

    /**
     * {@code GET  /rohstoffs} : get all the rohstoffs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rohstoffs in body.
     */
    @GetMapping("/rohstoffs")
    public List<Rohstoff> getAllRohstoffs() {
        log.debug("REST request to get all Rohstoffs");
        return rohstoffRepository.findAll();
    }

    /**
     * {@code GET  /rohstoffs/:id} : get the "id" rohstoff.
     *
     * @param id the id of the rohstoff to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rohstoff, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/rohstoffs/{id}")
    public ResponseEntity<Rohstoff> getRohstoff(@PathVariable Long id) {
        log.debug("REST request to get Rohstoff : {}", id);
        Optional<Rohstoff> rohstoff = rohstoffRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(rohstoff);
    }

    /**
     * {@code DELETE  /rohstoffs/:id} : delete the "id" rohstoff.
     *
     * @param id the id of the rohstoff to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/rohstoffs/{id}")
    public ResponseEntity<Void> deleteRohstoff(@PathVariable Long id) {
        log.debug("REST request to delete Rohstoff : {}", id);
        rohstoffRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
