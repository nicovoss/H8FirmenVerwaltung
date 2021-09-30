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
import xyz.dulli.domain.ArtikelTyp;
import xyz.dulli.repository.ArtikelTypRepository;
import xyz.dulli.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link xyz.dulli.domain.ArtikelTyp}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ArtikelTypResource {

    private final Logger log = LoggerFactory.getLogger(ArtikelTypResource.class);

    private static final String ENTITY_NAME = "artikelTyp";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ArtikelTypRepository artikelTypRepository;

    public ArtikelTypResource(ArtikelTypRepository artikelTypRepository) {
        this.artikelTypRepository = artikelTypRepository;
    }

    /**
     * {@code POST  /artikel-typs} : Create a new artikelTyp.
     *
     * @param artikelTyp the artikelTyp to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new artikelTyp, or with status {@code 400 (Bad Request)} if the artikelTyp has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/artikel-typs")
    public ResponseEntity<ArtikelTyp> createArtikelTyp(@RequestBody ArtikelTyp artikelTyp) throws URISyntaxException {
        log.debug("REST request to save ArtikelTyp : {}", artikelTyp);
        if (artikelTyp.getId() != null) {
            throw new BadRequestAlertException("A new artikelTyp cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ArtikelTyp result = artikelTypRepository.save(artikelTyp);
        return ResponseEntity
            .created(new URI("/api/artikel-typs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /artikel-typs/:id} : Updates an existing artikelTyp.
     *
     * @param id the id of the artikelTyp to save.
     * @param artikelTyp the artikelTyp to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated artikelTyp,
     * or with status {@code 400 (Bad Request)} if the artikelTyp is not valid,
     * or with status {@code 500 (Internal Server Error)} if the artikelTyp couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/artikel-typs/{id}")
    public ResponseEntity<ArtikelTyp> updateArtikelTyp(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ArtikelTyp artikelTyp
    ) throws URISyntaxException {
        log.debug("REST request to update ArtikelTyp : {}, {}", id, artikelTyp);
        if (artikelTyp.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, artikelTyp.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!artikelTypRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ArtikelTyp result = artikelTypRepository.save(artikelTyp);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, artikelTyp.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /artikel-typs/:id} : Partial updates given fields of an existing artikelTyp, field will ignore if it is null
     *
     * @param id the id of the artikelTyp to save.
     * @param artikelTyp the artikelTyp to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated artikelTyp,
     * or with status {@code 400 (Bad Request)} if the artikelTyp is not valid,
     * or with status {@code 404 (Not Found)} if the artikelTyp is not found,
     * or with status {@code 500 (Internal Server Error)} if the artikelTyp couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/artikel-typs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ArtikelTyp> partialUpdateArtikelTyp(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ArtikelTyp artikelTyp
    ) throws URISyntaxException {
        log.debug("REST request to partial update ArtikelTyp partially : {}, {}", id, artikelTyp);
        if (artikelTyp.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, artikelTyp.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!artikelTypRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ArtikelTyp> result = artikelTypRepository
            .findById(artikelTyp.getId())
            .map(existingArtikelTyp -> {
                if (artikelTyp.getName() != null) {
                    existingArtikelTyp.setName(artikelTyp.getName());
                }

                return existingArtikelTyp;
            })
            .map(artikelTypRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, artikelTyp.getId().toString())
        );
    }

    /**
     * {@code GET  /artikel-typs} : get all the artikelTyps.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of artikelTyps in body.
     */
    @GetMapping("/artikel-typs")
    public List<ArtikelTyp> getAllArtikelTyps() {
        log.debug("REST request to get all ArtikelTyps");
        return artikelTypRepository.findAll();
    }

    /**
     * {@code GET  /artikel-typs/:id} : get the "id" artikelTyp.
     *
     * @param id the id of the artikelTyp to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the artikelTyp, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/artikel-typs/{id}")
    public ResponseEntity<ArtikelTyp> getArtikelTyp(@PathVariable Long id) {
        log.debug("REST request to get ArtikelTyp : {}", id);
        Optional<ArtikelTyp> artikelTyp = artikelTypRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(artikelTyp);
    }

    /**
     * {@code DELETE  /artikel-typs/:id} : delete the "id" artikelTyp.
     *
     * @param id the id of the artikelTyp to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/artikel-typs/{id}")
    public ResponseEntity<Void> deleteArtikelTyp(@PathVariable Long id) {
        log.debug("REST request to delete ArtikelTyp : {}", id);
        artikelTypRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
