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
import xyz.dulli.domain.Artikel;
import xyz.dulli.repository.ArtikelRepository;
import xyz.dulli.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link xyz.dulli.domain.Artikel}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ArtikelResource {

    private final Logger log = LoggerFactory.getLogger(ArtikelResource.class);

    private static final String ENTITY_NAME = "artikel";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ArtikelRepository artikelRepository;

    public ArtikelResource(ArtikelRepository artikelRepository) {
        this.artikelRepository = artikelRepository;
    }

    /**
     * {@code POST  /artikels} : Create a new artikel.
     *
     * @param artikel the artikel to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new artikel, or with status {@code 400 (Bad Request)} if the artikel has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/artikels")
    public ResponseEntity<Artikel> createArtikel(@RequestBody Artikel artikel) throws URISyntaxException {
        log.debug("REST request to save Artikel : {}", artikel);
        if (artikel.getId() != null) {
            throw new BadRequestAlertException("A new artikel cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Artikel result = artikelRepository.save(artikel);
        return ResponseEntity
            .created(new URI("/api/artikels/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /artikels/:id} : Updates an existing artikel.
     *
     * @param id the id of the artikel to save.
     * @param artikel the artikel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated artikel,
     * or with status {@code 400 (Bad Request)} if the artikel is not valid,
     * or with status {@code 500 (Internal Server Error)} if the artikel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/artikels/{id}")
    public ResponseEntity<Artikel> updateArtikel(@PathVariable(value = "id", required = false) final Long id, @RequestBody Artikel artikel)
        throws URISyntaxException {
        log.debug("REST request to update Artikel : {}, {}", id, artikel);
        if (artikel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, artikel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!artikelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Artikel result = artikelRepository.save(artikel);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, artikel.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /artikels/:id} : Partial updates given fields of an existing artikel, field will ignore if it is null
     *
     * @param id the id of the artikel to save.
     * @param artikel the artikel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated artikel,
     * or with status {@code 400 (Bad Request)} if the artikel is not valid,
     * or with status {@code 404 (Not Found)} if the artikel is not found,
     * or with status {@code 500 (Internal Server Error)} if the artikel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/artikels/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Artikel> partialUpdateArtikel(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Artikel artikel
    ) throws URISyntaxException {
        log.debug("REST request to partial update Artikel partially : {}, {}", id, artikel);
        if (artikel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, artikel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!artikelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Artikel> result = artikelRepository
            .findById(artikel.getId())
            .map(existingArtikel -> {
                if (artikel.getName() != null) {
                    existingArtikel.setName(artikel.getName());
                }

                return existingArtikel;
            })
            .map(artikelRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, artikel.getId().toString())
        );
    }

    /**
     * {@code GET  /artikels} : get all the artikels.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of artikels in body.
     */
    @GetMapping("/artikels")
    public List<Artikel> getAllArtikels() {
        log.debug("REST request to get all Artikels");
        return artikelRepository.findAll();
    }

    /**
     * {@code GET  /artikels/:id} : get the "id" artikel.
     *
     * @param id the id of the artikel to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the artikel, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/artikels/{id}")
    public ResponseEntity<Artikel> getArtikel(@PathVariable Long id) {
        log.debug("REST request to get Artikel : {}", id);
        Optional<Artikel> artikel = artikelRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(artikel);
    }

    /**
     * {@code DELETE  /artikels/:id} : delete the "id" artikel.
     *
     * @param id the id of the artikel to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/artikels/{id}")
    public ResponseEntity<Void> deleteArtikel(@PathVariable Long id) {
        log.debug("REST request to delete Artikel : {}", id);
        artikelRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
