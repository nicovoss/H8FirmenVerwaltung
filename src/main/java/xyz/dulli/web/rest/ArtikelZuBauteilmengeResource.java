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
import xyz.dulli.domain.ArtikelZuBauteilmenge;
import xyz.dulli.repository.ArtikelZuBauteilmengeRepository;
import xyz.dulli.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link xyz.dulli.domain.ArtikelZuBauteilmenge}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ArtikelZuBauteilmengeResource {

    private final Logger log = LoggerFactory.getLogger(ArtikelZuBauteilmengeResource.class);

    private static final String ENTITY_NAME = "artikelZuBauteilmenge";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ArtikelZuBauteilmengeRepository artikelZuBauteilmengeRepository;

    public ArtikelZuBauteilmengeResource(ArtikelZuBauteilmengeRepository artikelZuBauteilmengeRepository) {
        this.artikelZuBauteilmengeRepository = artikelZuBauteilmengeRepository;
    }

    /**
     * {@code POST  /artikel-zu-bauteilmenges} : Create a new artikelZuBauteilmenge.
     *
     * @param artikelZuBauteilmenge the artikelZuBauteilmenge to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new artikelZuBauteilmenge, or with status {@code 400 (Bad Request)} if the artikelZuBauteilmenge has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/artikel-zu-bauteilmenges")
    public ResponseEntity<ArtikelZuBauteilmenge> createArtikelZuBauteilmenge(@RequestBody ArtikelZuBauteilmenge artikelZuBauteilmenge)
        throws URISyntaxException {
        log.debug("REST request to save ArtikelZuBauteilmenge : {}", artikelZuBauteilmenge);
        if (artikelZuBauteilmenge.getId() != null) {
            throw new BadRequestAlertException("A new artikelZuBauteilmenge cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ArtikelZuBauteilmenge result = artikelZuBauteilmengeRepository.save(artikelZuBauteilmenge);
        return ResponseEntity
            .created(new URI("/api/artikel-zu-bauteilmenges/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /artikel-zu-bauteilmenges/:id} : Updates an existing artikelZuBauteilmenge.
     *
     * @param id the id of the artikelZuBauteilmenge to save.
     * @param artikelZuBauteilmenge the artikelZuBauteilmenge to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated artikelZuBauteilmenge,
     * or with status {@code 400 (Bad Request)} if the artikelZuBauteilmenge is not valid,
     * or with status {@code 500 (Internal Server Error)} if the artikelZuBauteilmenge couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/artikel-zu-bauteilmenges/{id}")
    public ResponseEntity<ArtikelZuBauteilmenge> updateArtikelZuBauteilmenge(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ArtikelZuBauteilmenge artikelZuBauteilmenge
    ) throws URISyntaxException {
        log.debug("REST request to update ArtikelZuBauteilmenge : {}, {}", id, artikelZuBauteilmenge);
        if (artikelZuBauteilmenge.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, artikelZuBauteilmenge.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!artikelZuBauteilmengeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ArtikelZuBauteilmenge result = artikelZuBauteilmengeRepository.save(artikelZuBauteilmenge);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, artikelZuBauteilmenge.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /artikel-zu-bauteilmenges/:id} : Partial updates given fields of an existing artikelZuBauteilmenge, field will ignore if it is null
     *
     * @param id the id of the artikelZuBauteilmenge to save.
     * @param artikelZuBauteilmenge the artikelZuBauteilmenge to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated artikelZuBauteilmenge,
     * or with status {@code 400 (Bad Request)} if the artikelZuBauteilmenge is not valid,
     * or with status {@code 404 (Not Found)} if the artikelZuBauteilmenge is not found,
     * or with status {@code 500 (Internal Server Error)} if the artikelZuBauteilmenge couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/artikel-zu-bauteilmenges/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ArtikelZuBauteilmenge> partialUpdateArtikelZuBauteilmenge(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ArtikelZuBauteilmenge artikelZuBauteilmenge
    ) throws URISyntaxException {
        log.debug("REST request to partial update ArtikelZuBauteilmenge partially : {}, {}", id, artikelZuBauteilmenge);
        if (artikelZuBauteilmenge.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, artikelZuBauteilmenge.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!artikelZuBauteilmengeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ArtikelZuBauteilmenge> result = artikelZuBauteilmengeRepository
            .findById(artikelZuBauteilmenge.getId())
            .map(existingArtikelZuBauteilmenge -> {
                if (artikelZuBauteilmenge.getMenge() != null) {
                    existingArtikelZuBauteilmenge.setMenge(artikelZuBauteilmenge.getMenge());
                }

                return existingArtikelZuBauteilmenge;
            })
            .map(artikelZuBauteilmengeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, artikelZuBauteilmenge.getId().toString())
        );
    }

    /**
     * {@code GET  /artikel-zu-bauteilmenges} : get all the artikelZuBauteilmenges.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of artikelZuBauteilmenges in body.
     */
    @GetMapping("/artikel-zu-bauteilmenges")
    public List<ArtikelZuBauteilmenge> getAllArtikelZuBauteilmenges() {
        log.debug("REST request to get all ArtikelZuBauteilmenges");
        return artikelZuBauteilmengeRepository.findAll();
    }

    /**
     * {@code GET  /artikel-zu-bauteilmenges/:id} : get the "id" artikelZuBauteilmenge.
     *
     * @param id the id of the artikelZuBauteilmenge to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the artikelZuBauteilmenge, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/artikel-zu-bauteilmenges/{id}")
    public ResponseEntity<ArtikelZuBauteilmenge> getArtikelZuBauteilmenge(@PathVariable Long id) {
        log.debug("REST request to get ArtikelZuBauteilmenge : {}", id);
        Optional<ArtikelZuBauteilmenge> artikelZuBauteilmenge = artikelZuBauteilmengeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(artikelZuBauteilmenge);
    }

    /**
     * {@code DELETE  /artikel-zu-bauteilmenges/:id} : delete the "id" artikelZuBauteilmenge.
     *
     * @param id the id of the artikelZuBauteilmenge to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/artikel-zu-bauteilmenges/{id}")
    public ResponseEntity<Void> deleteArtikelZuBauteilmenge(@PathVariable Long id) {
        log.debug("REST request to delete ArtikelZuBauteilmenge : {}", id);
        artikelZuBauteilmengeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
