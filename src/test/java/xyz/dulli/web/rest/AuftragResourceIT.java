package xyz.dulli.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import xyz.dulli.IntegrationTest;
import xyz.dulli.domain.Auftrag;
import xyz.dulli.repository.AuftragRepository;

/**
 * Integration tests for the {@link AuftragResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AuftragResourceIT {

    private static final Instant DEFAULT_ERFASST_AM = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_ERFASST_AM = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_FAELLIG_AM = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_FAELLIG_AM = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_BEZAHL = false;
    private static final Boolean UPDATED_BEZAHL = true;

    private static final Instant DEFAULT_BEZAHLT_AM = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_BEZAHLT_AM = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_ABGESCHLOSSEN_AM = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_ABGESCHLOSSEN_AM = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_KOMMENTAR = "AAAAAAAAAA";
    private static final String UPDATED_KOMMENTAR = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/auftrags";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AuftragRepository auftragRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAuftragMockMvc;

    private Auftrag auftrag;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Auftrag createEntity(EntityManager em) {
        Auftrag auftrag = new Auftrag()
            .erfasstAm(DEFAULT_ERFASST_AM)
            .faelligAm(DEFAULT_FAELLIG_AM)
            .bezahl(DEFAULT_BEZAHL)
            .bezahltAm(DEFAULT_BEZAHLT_AM)
            .abgeschlossenAm(DEFAULT_ABGESCHLOSSEN_AM)
            .kommentar(DEFAULT_KOMMENTAR);
        return auftrag;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Auftrag createUpdatedEntity(EntityManager em) {
        Auftrag auftrag = new Auftrag()
            .erfasstAm(UPDATED_ERFASST_AM)
            .faelligAm(UPDATED_FAELLIG_AM)
            .bezahl(UPDATED_BEZAHL)
            .bezahltAm(UPDATED_BEZAHLT_AM)
            .abgeschlossenAm(UPDATED_ABGESCHLOSSEN_AM)
            .kommentar(UPDATED_KOMMENTAR);
        return auftrag;
    }

    @BeforeEach
    public void initTest() {
        auftrag = createEntity(em);
    }

    @Test
    @Transactional
    void createAuftrag() throws Exception {
        int databaseSizeBeforeCreate = auftragRepository.findAll().size();
        // Create the Auftrag
        restAuftragMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(auftrag))
            )
            .andExpect(status().isCreated());

        // Validate the Auftrag in the database
        List<Auftrag> auftragList = auftragRepository.findAll();
        assertThat(auftragList).hasSize(databaseSizeBeforeCreate + 1);
        Auftrag testAuftrag = auftragList.get(auftragList.size() - 1);
        assertThat(testAuftrag.getErfasstAm()).isEqualTo(DEFAULT_ERFASST_AM);
        assertThat(testAuftrag.getFaelligAm()).isEqualTo(DEFAULT_FAELLIG_AM);
        assertThat(testAuftrag.getBezahl()).isEqualTo(DEFAULT_BEZAHL);
        assertThat(testAuftrag.getBezahltAm()).isEqualTo(DEFAULT_BEZAHLT_AM);
        assertThat(testAuftrag.getAbgeschlossenAm()).isEqualTo(DEFAULT_ABGESCHLOSSEN_AM);
        assertThat(testAuftrag.getKommentar()).isEqualTo(DEFAULT_KOMMENTAR);
    }

    @Test
    @Transactional
    void createAuftragWithExistingId() throws Exception {
        // Create the Auftrag with an existing ID
        auftrag.setId(1L);

        int databaseSizeBeforeCreate = auftragRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAuftragMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(auftrag))
            )
            .andExpect(status().isBadRequest());

        // Validate the Auftrag in the database
        List<Auftrag> auftragList = auftragRepository.findAll();
        assertThat(auftragList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAuftrags() throws Exception {
        // Initialize the database
        auftragRepository.saveAndFlush(auftrag);

        // Get all the auftragList
        restAuftragMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(auftrag.getId().intValue())))
            .andExpect(jsonPath("$.[*].erfasstAm").value(hasItem(DEFAULT_ERFASST_AM.toString())))
            .andExpect(jsonPath("$.[*].faelligAm").value(hasItem(DEFAULT_FAELLIG_AM.toString())))
            .andExpect(jsonPath("$.[*].bezahl").value(hasItem(DEFAULT_BEZAHL.booleanValue())))
            .andExpect(jsonPath("$.[*].bezahltAm").value(hasItem(DEFAULT_BEZAHLT_AM.toString())))
            .andExpect(jsonPath("$.[*].abgeschlossenAm").value(hasItem(DEFAULT_ABGESCHLOSSEN_AM.toString())))
            .andExpect(jsonPath("$.[*].kommentar").value(hasItem(DEFAULT_KOMMENTAR)));
    }

    @Test
    @Transactional
    void getAuftrag() throws Exception {
        // Initialize the database
        auftragRepository.saveAndFlush(auftrag);

        // Get the auftrag
        restAuftragMockMvc
            .perform(get(ENTITY_API_URL_ID, auftrag.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(auftrag.getId().intValue()))
            .andExpect(jsonPath("$.erfasstAm").value(DEFAULT_ERFASST_AM.toString()))
            .andExpect(jsonPath("$.faelligAm").value(DEFAULT_FAELLIG_AM.toString()))
            .andExpect(jsonPath("$.bezahl").value(DEFAULT_BEZAHL.booleanValue()))
            .andExpect(jsonPath("$.bezahltAm").value(DEFAULT_BEZAHLT_AM.toString()))
            .andExpect(jsonPath("$.abgeschlossenAm").value(DEFAULT_ABGESCHLOSSEN_AM.toString()))
            .andExpect(jsonPath("$.kommentar").value(DEFAULT_KOMMENTAR));
    }

    @Test
    @Transactional
    void getNonExistingAuftrag() throws Exception {
        // Get the auftrag
        restAuftragMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAuftrag() throws Exception {
        // Initialize the database
        auftragRepository.saveAndFlush(auftrag);

        int databaseSizeBeforeUpdate = auftragRepository.findAll().size();

        // Update the auftrag
        Auftrag updatedAuftrag = auftragRepository.findById(auftrag.getId()).get();
        // Disconnect from session so that the updates on updatedAuftrag are not directly saved in db
        em.detach(updatedAuftrag);
        updatedAuftrag
            .erfasstAm(UPDATED_ERFASST_AM)
            .faelligAm(UPDATED_FAELLIG_AM)
            .bezahl(UPDATED_BEZAHL)
            .bezahltAm(UPDATED_BEZAHLT_AM)
            .abgeschlossenAm(UPDATED_ABGESCHLOSSEN_AM)
            .kommentar(UPDATED_KOMMENTAR);

        restAuftragMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAuftrag.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAuftrag))
            )
            .andExpect(status().isOk());

        // Validate the Auftrag in the database
        List<Auftrag> auftragList = auftragRepository.findAll();
        assertThat(auftragList).hasSize(databaseSizeBeforeUpdate);
        Auftrag testAuftrag = auftragList.get(auftragList.size() - 1);
        assertThat(testAuftrag.getErfasstAm()).isEqualTo(UPDATED_ERFASST_AM);
        assertThat(testAuftrag.getFaelligAm()).isEqualTo(UPDATED_FAELLIG_AM);
        assertThat(testAuftrag.getBezahl()).isEqualTo(UPDATED_BEZAHL);
        assertThat(testAuftrag.getBezahltAm()).isEqualTo(UPDATED_BEZAHLT_AM);
        assertThat(testAuftrag.getAbgeschlossenAm()).isEqualTo(UPDATED_ABGESCHLOSSEN_AM);
        assertThat(testAuftrag.getKommentar()).isEqualTo(UPDATED_KOMMENTAR);
    }

    @Test
    @Transactional
    void putNonExistingAuftrag() throws Exception {
        int databaseSizeBeforeUpdate = auftragRepository.findAll().size();
        auftrag.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAuftragMockMvc
            .perform(
                put(ENTITY_API_URL_ID, auftrag.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(auftrag))
            )
            .andExpect(status().isBadRequest());

        // Validate the Auftrag in the database
        List<Auftrag> auftragList = auftragRepository.findAll();
        assertThat(auftragList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAuftrag() throws Exception {
        int databaseSizeBeforeUpdate = auftragRepository.findAll().size();
        auftrag.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuftragMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(auftrag))
            )
            .andExpect(status().isBadRequest());

        // Validate the Auftrag in the database
        List<Auftrag> auftragList = auftragRepository.findAll();
        assertThat(auftragList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAuftrag() throws Exception {
        int databaseSizeBeforeUpdate = auftragRepository.findAll().size();
        auftrag.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuftragMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(auftrag))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Auftrag in the database
        List<Auftrag> auftragList = auftragRepository.findAll();
        assertThat(auftragList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAuftragWithPatch() throws Exception {
        // Initialize the database
        auftragRepository.saveAndFlush(auftrag);

        int databaseSizeBeforeUpdate = auftragRepository.findAll().size();

        // Update the auftrag using partial update
        Auftrag partialUpdatedAuftrag = new Auftrag();
        partialUpdatedAuftrag.setId(auftrag.getId());

        partialUpdatedAuftrag.bezahltAm(UPDATED_BEZAHLT_AM).abgeschlossenAm(UPDATED_ABGESCHLOSSEN_AM);

        restAuftragMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAuftrag.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAuftrag))
            )
            .andExpect(status().isOk());

        // Validate the Auftrag in the database
        List<Auftrag> auftragList = auftragRepository.findAll();
        assertThat(auftragList).hasSize(databaseSizeBeforeUpdate);
        Auftrag testAuftrag = auftragList.get(auftragList.size() - 1);
        assertThat(testAuftrag.getErfasstAm()).isEqualTo(DEFAULT_ERFASST_AM);
        assertThat(testAuftrag.getFaelligAm()).isEqualTo(DEFAULT_FAELLIG_AM);
        assertThat(testAuftrag.getBezahl()).isEqualTo(DEFAULT_BEZAHL);
        assertThat(testAuftrag.getBezahltAm()).isEqualTo(UPDATED_BEZAHLT_AM);
        assertThat(testAuftrag.getAbgeschlossenAm()).isEqualTo(UPDATED_ABGESCHLOSSEN_AM);
        assertThat(testAuftrag.getKommentar()).isEqualTo(DEFAULT_KOMMENTAR);
    }

    @Test
    @Transactional
    void fullUpdateAuftragWithPatch() throws Exception {
        // Initialize the database
        auftragRepository.saveAndFlush(auftrag);

        int databaseSizeBeforeUpdate = auftragRepository.findAll().size();

        // Update the auftrag using partial update
        Auftrag partialUpdatedAuftrag = new Auftrag();
        partialUpdatedAuftrag.setId(auftrag.getId());

        partialUpdatedAuftrag
            .erfasstAm(UPDATED_ERFASST_AM)
            .faelligAm(UPDATED_FAELLIG_AM)
            .bezahl(UPDATED_BEZAHL)
            .bezahltAm(UPDATED_BEZAHLT_AM)
            .abgeschlossenAm(UPDATED_ABGESCHLOSSEN_AM)
            .kommentar(UPDATED_KOMMENTAR);

        restAuftragMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAuftrag.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAuftrag))
            )
            .andExpect(status().isOk());

        // Validate the Auftrag in the database
        List<Auftrag> auftragList = auftragRepository.findAll();
        assertThat(auftragList).hasSize(databaseSizeBeforeUpdate);
        Auftrag testAuftrag = auftragList.get(auftragList.size() - 1);
        assertThat(testAuftrag.getErfasstAm()).isEqualTo(UPDATED_ERFASST_AM);
        assertThat(testAuftrag.getFaelligAm()).isEqualTo(UPDATED_FAELLIG_AM);
        assertThat(testAuftrag.getBezahl()).isEqualTo(UPDATED_BEZAHL);
        assertThat(testAuftrag.getBezahltAm()).isEqualTo(UPDATED_BEZAHLT_AM);
        assertThat(testAuftrag.getAbgeschlossenAm()).isEqualTo(UPDATED_ABGESCHLOSSEN_AM);
        assertThat(testAuftrag.getKommentar()).isEqualTo(UPDATED_KOMMENTAR);
    }

    @Test
    @Transactional
    void patchNonExistingAuftrag() throws Exception {
        int databaseSizeBeforeUpdate = auftragRepository.findAll().size();
        auftrag.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAuftragMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, auftrag.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(auftrag))
            )
            .andExpect(status().isBadRequest());

        // Validate the Auftrag in the database
        List<Auftrag> auftragList = auftragRepository.findAll();
        assertThat(auftragList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAuftrag() throws Exception {
        int databaseSizeBeforeUpdate = auftragRepository.findAll().size();
        auftrag.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuftragMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(auftrag))
            )
            .andExpect(status().isBadRequest());

        // Validate the Auftrag in the database
        List<Auftrag> auftragList = auftragRepository.findAll();
        assertThat(auftragList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAuftrag() throws Exception {
        int databaseSizeBeforeUpdate = auftragRepository.findAll().size();
        auftrag.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuftragMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(auftrag))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Auftrag in the database
        List<Auftrag> auftragList = auftragRepository.findAll();
        assertThat(auftragList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAuftrag() throws Exception {
        // Initialize the database
        auftragRepository.saveAndFlush(auftrag);

        int databaseSizeBeforeDelete = auftragRepository.findAll().size();

        // Delete the auftrag
        restAuftragMockMvc
            .perform(delete(ENTITY_API_URL_ID, auftrag.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Auftrag> auftragList = auftragRepository.findAll();
        assertThat(auftragList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
