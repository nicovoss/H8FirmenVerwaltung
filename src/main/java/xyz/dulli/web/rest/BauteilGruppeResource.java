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
import xyz.dulli.domain.BauteilGruppe;
import xyz.dulli.repository.BauteilGruppeRepository;
import xyz.dulli.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link xyz.dulli.domain.BauteilGruppe}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BauteilGruppeResource {

    private final Logger log = LoggerFactory.getLogger(BauteilGruppeResource.class);

    private static final String ENTITY_NAME = "bauteilGruppe";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BauteilGruppeRepository bauteilGruppeRepository;

    public BauteilGruppeResource(BauteilGruppeRepository bauteilGruppeRepository) {
        this.bauteilGruppeRepository = bauteilGruppeRepository;
    }

    /**
     * {@code POST  /bauteil-gruppes} : Create a new bauteilGruppe.
     *
     * @param bauteilGruppe the bauteilGruppe to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bauteilGruppe, or with status {@code 400 (Bad Request)} if the bauteilGruppe has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bauteil-gruppes")
    public ResponseEntity<BauteilGruppe> createBauteilGruppe(@RequestBody BauteilGruppe bauteilGruppe) throws URISyntaxException {
        log.debug("REST request to save BauteilGruppe : {}", bauteilGruppe);
        if (bauteilGruppe.getId() != null) {
            throw new BadRequestAlertException("A new bauteilGruppe cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BauteilGruppe result = bauteilGruppeRepository.save(bauteilGruppe);
        return ResponseEntity
            .created(new URI("/api/bauteil-gruppes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bauteil-gruppes/:id} : Updates an existing bauteilGruppe.
     *
     * @param id the id of the bauteilGruppe to save.
     * @param bauteilGruppe the bauteilGruppe to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bauteilGruppe,
     * or with status {@code 400 (Bad Request)} if the bauteilGruppe is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bauteilGruppe couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bauteil-gruppes/{id}")
    public ResponseEntity<BauteilGruppe> updateBauteilGruppe(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BauteilGruppe bauteilGruppe
    ) throws URISyntaxException {
        log.debug("REST request to update BauteilGruppe : {}, {}", id, bauteilGruppe);
        if (bauteilGruppe.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bauteilGruppe.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bauteilGruppeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BauteilGruppe result = bauteilGruppeRepository.save(bauteilGruppe);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bauteilGruppe.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bauteil-gruppes/:id} : Partial updates given fields of an existing bauteilGruppe, field will ignore if it is null
     *
     * @param id the id of the bauteilGruppe to save.
     * @param bauteilGruppe the bauteilGruppe to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bauteilGruppe,
     * or with status {@code 400 (Bad Request)} if the bauteilGruppe is not valid,
     * or with status {@code 404 (Not Found)} if the bauteilGruppe is not found,
     * or with status {@code 500 (Internal Server Error)} if the bauteilGruppe couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bauteil-gruppes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BauteilGruppe> partialUpdateBauteilGruppe(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BauteilGruppe bauteilGruppe
    ) throws URISyntaxException {
        log.debug("REST request to partial update BauteilGruppe partially : {}, {}", id, bauteilGruppe);
        if (bauteilGruppe.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bauteilGruppe.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bauteilGruppeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BauteilGruppe> result = bauteilGruppeRepository
            .findById(bauteilGruppe.getId())
            .map(existingBauteilGruppe -> {
                if (bauteilGruppe.getName() != null) {
                    existingBauteilGruppe.setName(bauteilGruppe.getName());
                }

                return existingBauteilGruppe;
            })
            .map(bauteilGruppeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bauteilGruppe.getId().toString())
        );
    }

    /**
     * {@code GET  /bauteil-gruppes} : get all the bauteilGruppes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bauteilGruppes in body.
     */
    @GetMapping("/bauteil-gruppes")
    public List<BauteilGruppe> getAllBauteilGruppes() {
        log.debug("REST request to get all BauteilGruppes");
        return bauteilGruppeRepository.findAll();
    }

    /**
     * {@code GET  /bauteil-gruppes/:id} : get the "id" bauteilGruppe.
     *
     * @param id the id of the bauteilGruppe to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bauteilGruppe, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bauteil-gruppes/{id}")
    public ResponseEntity<BauteilGruppe> getBauteilGruppe(@PathVariable Long id) {
        log.debug("REST request to get BauteilGruppe : {}", id);
        Optional<BauteilGruppe> bauteilGruppe = bauteilGruppeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bauteilGruppe);
    }

    /**
     * {@code DELETE  /bauteil-gruppes/:id} : delete the "id" bauteilGruppe.
     *
     * @param id the id of the bauteilGruppe to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bauteil-gruppes/{id}")
    public ResponseEntity<Void> deleteBauteilGruppe(@PathVariable Long id) {
        log.debug("REST request to delete BauteilGruppe : {}", id);
        bauteilGruppeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
