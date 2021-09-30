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
import xyz.dulli.domain.BauteileZuRohstoffe;
import xyz.dulli.repository.BauteileZuRohstoffeRepository;
import xyz.dulli.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link xyz.dulli.domain.BauteileZuRohstoffe}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BauteileZuRohstoffeResource {

    private final Logger log = LoggerFactory.getLogger(BauteileZuRohstoffeResource.class);

    private static final String ENTITY_NAME = "bauteileZuRohstoffe";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BauteileZuRohstoffeRepository bauteileZuRohstoffeRepository;

    public BauteileZuRohstoffeResource(BauteileZuRohstoffeRepository bauteileZuRohstoffeRepository) {
        this.bauteileZuRohstoffeRepository = bauteileZuRohstoffeRepository;
    }

    /**
     * {@code POST  /bauteile-zu-rohstoffes} : Create a new bauteileZuRohstoffe.
     *
     * @param bauteileZuRohstoffe the bauteileZuRohstoffe to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bauteileZuRohstoffe, or with status {@code 400 (Bad Request)} if the bauteileZuRohstoffe has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bauteile-zu-rohstoffes")
    public ResponseEntity<BauteileZuRohstoffe> createBauteileZuRohstoffe(@RequestBody BauteileZuRohstoffe bauteileZuRohstoffe)
        throws URISyntaxException {
        log.debug("REST request to save BauteileZuRohstoffe : {}", bauteileZuRohstoffe);
        if (bauteileZuRohstoffe.getId() != null) {
            throw new BadRequestAlertException("A new bauteileZuRohstoffe cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BauteileZuRohstoffe result = bauteileZuRohstoffeRepository.save(bauteileZuRohstoffe);
        return ResponseEntity
            .created(new URI("/api/bauteile-zu-rohstoffes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bauteile-zu-rohstoffes/:id} : Updates an existing bauteileZuRohstoffe.
     *
     * @param id the id of the bauteileZuRohstoffe to save.
     * @param bauteileZuRohstoffe the bauteileZuRohstoffe to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bauteileZuRohstoffe,
     * or with status {@code 400 (Bad Request)} if the bauteileZuRohstoffe is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bauteileZuRohstoffe couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bauteile-zu-rohstoffes/{id}")
    public ResponseEntity<BauteileZuRohstoffe> updateBauteileZuRohstoffe(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BauteileZuRohstoffe bauteileZuRohstoffe
    ) throws URISyntaxException {
        log.debug("REST request to update BauteileZuRohstoffe : {}, {}", id, bauteileZuRohstoffe);
        if (bauteileZuRohstoffe.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bauteileZuRohstoffe.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bauteileZuRohstoffeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BauteileZuRohstoffe result = bauteileZuRohstoffeRepository.save(bauteileZuRohstoffe);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bauteileZuRohstoffe.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bauteile-zu-rohstoffes/:id} : Partial updates given fields of an existing bauteileZuRohstoffe, field will ignore if it is null
     *
     * @param id the id of the bauteileZuRohstoffe to save.
     * @param bauteileZuRohstoffe the bauteileZuRohstoffe to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bauteileZuRohstoffe,
     * or with status {@code 400 (Bad Request)} if the bauteileZuRohstoffe is not valid,
     * or with status {@code 404 (Not Found)} if the bauteileZuRohstoffe is not found,
     * or with status {@code 500 (Internal Server Error)} if the bauteileZuRohstoffe couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bauteile-zu-rohstoffes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BauteileZuRohstoffe> partialUpdateBauteileZuRohstoffe(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BauteileZuRohstoffe bauteileZuRohstoffe
    ) throws URISyntaxException {
        log.debug("REST request to partial update BauteileZuRohstoffe partially : {}, {}", id, bauteileZuRohstoffe);
        if (bauteileZuRohstoffe.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bauteileZuRohstoffe.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bauteileZuRohstoffeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BauteileZuRohstoffe> result = bauteileZuRohstoffeRepository
            .findById(bauteileZuRohstoffe.getId())
            .map(existingBauteileZuRohstoffe -> {
                if (bauteileZuRohstoffe.getMenge() != null) {
                    existingBauteileZuRohstoffe.setMenge(bauteileZuRohstoffe.getMenge());
                }

                return existingBauteileZuRohstoffe;
            })
            .map(bauteileZuRohstoffeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bauteileZuRohstoffe.getId().toString())
        );
    }

    /**
     * {@code GET  /bauteile-zu-rohstoffes} : get all the bauteileZuRohstoffes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bauteileZuRohstoffes in body.
     */
    @GetMapping("/bauteile-zu-rohstoffes")
    public List<BauteileZuRohstoffe> getAllBauteileZuRohstoffes() {
        log.debug("REST request to get all BauteileZuRohstoffes");
        return bauteileZuRohstoffeRepository.findAll();
    }

    /**
     * {@code GET  /bauteile-zu-rohstoffes/:id} : get the "id" bauteileZuRohstoffe.
     *
     * @param id the id of the bauteileZuRohstoffe to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bauteileZuRohstoffe, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bauteile-zu-rohstoffes/{id}")
    public ResponseEntity<BauteileZuRohstoffe> getBauteileZuRohstoffe(@PathVariable Long id) {
        log.debug("REST request to get BauteileZuRohstoffe : {}", id);
        Optional<BauteileZuRohstoffe> bauteileZuRohstoffe = bauteileZuRohstoffeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bauteileZuRohstoffe);
    }

    /**
     * {@code DELETE  /bauteile-zu-rohstoffes/:id} : delete the "id" bauteileZuRohstoffe.
     *
     * @param id the id of the bauteileZuRohstoffe to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bauteile-zu-rohstoffes/{id}")
    public ResponseEntity<Void> deleteBauteileZuRohstoffe(@PathVariable Long id) {
        log.debug("REST request to delete BauteileZuRohstoffe : {}", id);
        bauteileZuRohstoffeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
