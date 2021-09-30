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
import xyz.dulli.domain.Auftrag;
import xyz.dulli.repository.AuftragRepository;
import xyz.dulli.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link xyz.dulli.domain.Auftrag}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AuftragResource {

    private final Logger log = LoggerFactory.getLogger(AuftragResource.class);

    private static final String ENTITY_NAME = "auftrag";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AuftragRepository auftragRepository;

    public AuftragResource(AuftragRepository auftragRepository) {
        this.auftragRepository = auftragRepository;
    }

    /**
     * {@code POST  /auftrags} : Create a new auftrag.
     *
     * @param auftrag the auftrag to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new auftrag, or with status {@code 400 (Bad Request)} if the auftrag has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/auftrags")
    public ResponseEntity<Auftrag> createAuftrag(@RequestBody Auftrag auftrag) throws URISyntaxException {
        log.debug("REST request to save Auftrag : {}", auftrag);
        if (auftrag.getId() != null) {
            throw new BadRequestAlertException("A new auftrag cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Auftrag result = auftragRepository.save(auftrag);
        return ResponseEntity
            .created(new URI("/api/auftrags/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /auftrags/:id} : Updates an existing auftrag.
     *
     * @param id the id of the auftrag to save.
     * @param auftrag the auftrag to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated auftrag,
     * or with status {@code 400 (Bad Request)} if the auftrag is not valid,
     * or with status {@code 500 (Internal Server Error)} if the auftrag couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/auftrags/{id}")
    public ResponseEntity<Auftrag> updateAuftrag(@PathVariable(value = "id", required = false) final Long id, @RequestBody Auftrag auftrag)
        throws URISyntaxException {
        log.debug("REST request to update Auftrag : {}, {}", id, auftrag);
        if (auftrag.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, auftrag.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!auftragRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Auftrag result = auftragRepository.save(auftrag);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, auftrag.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /auftrags/:id} : Partial updates given fields of an existing auftrag, field will ignore if it is null
     *
     * @param id the id of the auftrag to save.
     * @param auftrag the auftrag to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated auftrag,
     * or with status {@code 400 (Bad Request)} if the auftrag is not valid,
     * or with status {@code 404 (Not Found)} if the auftrag is not found,
     * or with status {@code 500 (Internal Server Error)} if the auftrag couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/auftrags/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Auftrag> partialUpdateAuftrag(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Auftrag auftrag
    ) throws URISyntaxException {
        log.debug("REST request to partial update Auftrag partially : {}, {}", id, auftrag);
        if (auftrag.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, auftrag.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!auftragRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Auftrag> result = auftragRepository
            .findById(auftrag.getId())
            .map(existingAuftrag -> {
                if (auftrag.getErfasstAm() != null) {
                    existingAuftrag.setErfasstAm(auftrag.getErfasstAm());
                }
                if (auftrag.getFaelligAm() != null) {
                    existingAuftrag.setFaelligAm(auftrag.getFaelligAm());
                }
                if (auftrag.getBezahl() != null) {
                    existingAuftrag.setBezahl(auftrag.getBezahl());
                }
                if (auftrag.getBezahltAm() != null) {
                    existingAuftrag.setBezahltAm(auftrag.getBezahltAm());
                }
                if (auftrag.getAbgeschlossenAm() != null) {
                    existingAuftrag.setAbgeschlossenAm(auftrag.getAbgeschlossenAm());
                }
                if (auftrag.getKommentar() != null) {
                    existingAuftrag.setKommentar(auftrag.getKommentar());
                }

                return existingAuftrag;
            })
            .map(auftragRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, auftrag.getId().toString())
        );
    }

    /**
     * {@code GET  /auftrags} : get all the auftrags.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of auftrags in body.
     */
    @GetMapping("/auftrags")
    public List<Auftrag> getAllAuftrags() {
        log.debug("REST request to get all Auftrags");
        return auftragRepository.findAll();
    }

    /**
     * {@code GET  /auftrags/:id} : get the "id" auftrag.
     *
     * @param id the id of the auftrag to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the auftrag, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/auftrags/{id}")
    public ResponseEntity<Auftrag> getAuftrag(@PathVariable Long id) {
        log.debug("REST request to get Auftrag : {}", id);
        Optional<Auftrag> auftrag = auftragRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(auftrag);
    }

    /**
     * {@code DELETE  /auftrags/:id} : delete the "id" auftrag.
     *
     * @param id the id of the auftrag to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/auftrags/{id}")
    public ResponseEntity<Void> deleteAuftrag(@PathVariable Long id) {
        log.debug("REST request to delete Auftrag : {}", id);
        auftragRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
