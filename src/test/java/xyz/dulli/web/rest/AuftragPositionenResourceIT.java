package xyz.dulli.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import xyz.dulli.domain.AuftragPositionen;
import xyz.dulli.repository.AuftragPositionenRepository;

/**
 * Integration tests for the {@link AuftragPositionenResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AuftragPositionenResourceIT {

    private static final Integer DEFAULT_MENGE = 1;
    private static final Integer UPDATED_MENGE = 2;

    private static final String ENTITY_API_URL = "/api/auftrag-positionens";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AuftragPositionenRepository auftragPositionenRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAuftragPositionenMockMvc;

    private AuftragPositionen auftragPositionen;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AuftragPositionen createEntity(EntityManager em) {
        AuftragPositionen auftragPositionen = new AuftragPositionen().menge(DEFAULT_MENGE);
        return auftragPositionen;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AuftragPositionen createUpdatedEntity(EntityManager em) {
        AuftragPositionen auftragPositionen = new AuftragPositionen().menge(UPDATED_MENGE);
        return auftragPositionen;
    }

    @BeforeEach
    public void initTest() {
        auftragPositionen = createEntity(em);
    }

    @Test
    @Transactional
    void createAuftragPositionen() throws Exception {
        int databaseSizeBeforeCreate = auftragPositionenRepository.findAll().size();
        // Create the AuftragPositionen
        restAuftragPositionenMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(auftragPositionen))
            )
            .andExpect(status().isCreated());

        // Validate the AuftragPositionen in the database
        List<AuftragPositionen> auftragPositionenList = auftragPositionenRepository.findAll();
        assertThat(auftragPositionenList).hasSize(databaseSizeBeforeCreate + 1);
        AuftragPositionen testAuftragPositionen = auftragPositionenList.get(auftragPositionenList.size() - 1);
        assertThat(testAuftragPositionen.getMenge()).isEqualTo(DEFAULT_MENGE);
    }

    @Test
    @Transactional
    void createAuftragPositionenWithExistingId() throws Exception {
        // Create the AuftragPositionen with an existing ID
        auftragPositionen.setId(1L);

        int databaseSizeBeforeCreate = auftragPositionenRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAuftragPositionenMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(auftragPositionen))
            )
            .andExpect(status().isBadRequest());

        // Validate the AuftragPositionen in the database
        List<AuftragPositionen> auftragPositionenList = auftragPositionenRepository.findAll();
        assertThat(auftragPositionenList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAuftragPositionens() throws Exception {
        // Initialize the database
        auftragPositionenRepository.saveAndFlush(auftragPositionen);

        // Get all the auftragPositionenList
        restAuftragPositionenMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(auftragPositionen.getId().intValue())))
            .andExpect(jsonPath("$.[*].menge").value(hasItem(DEFAULT_MENGE)));
    }

    @Test
    @Transactional
    void getAuftragPositionen() throws Exception {
        // Initialize the database
        auftragPositionenRepository.saveAndFlush(auftragPositionen);

        // Get the auftragPositionen
        restAuftragPositionenMockMvc
            .perform(get(ENTITY_API_URL_ID, auftragPositionen.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(auftragPositionen.getId().intValue()))
            .andExpect(jsonPath("$.menge").value(DEFAULT_MENGE));
    }

    @Test
    @Transactional
    void getNonExistingAuftragPositionen() throws Exception {
        // Get the auftragPositionen
        restAuftragPositionenMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAuftragPositionen() throws Exception {
        // Initialize the database
        auftragPositionenRepository.saveAndFlush(auftragPositionen);

        int databaseSizeBeforeUpdate = auftragPositionenRepository.findAll().size();

        // Update the auftragPositionen
        AuftragPositionen updatedAuftragPositionen = auftragPositionenRepository.findById(auftragPositionen.getId()).get();
        // Disconnect from session so that the updates on updatedAuftragPositionen are not directly saved in db
        em.detach(updatedAuftragPositionen);
        updatedAuftragPositionen.menge(UPDATED_MENGE);

        restAuftragPositionenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAuftragPositionen.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAuftragPositionen))
            )
            .andExpect(status().isOk());

        // Validate the AuftragPositionen in the database
        List<AuftragPositionen> auftragPositionenList = auftragPositionenRepository.findAll();
        assertThat(auftragPositionenList).hasSize(databaseSizeBeforeUpdate);
        AuftragPositionen testAuftragPositionen = auftragPositionenList.get(auftragPositionenList.size() - 1);
        assertThat(testAuftragPositionen.getMenge()).isEqualTo(UPDATED_MENGE);
    }

    @Test
    @Transactional
    void putNonExistingAuftragPositionen() throws Exception {
        int databaseSizeBeforeUpdate = auftragPositionenRepository.findAll().size();
        auftragPositionen.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAuftragPositionenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, auftragPositionen.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(auftragPositionen))
            )
            .andExpect(status().isBadRequest());

        // Validate the AuftragPositionen in the database
        List<AuftragPositionen> auftragPositionenList = auftragPositionenRepository.findAll();
        assertThat(auftragPositionenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAuftragPositionen() throws Exception {
        int databaseSizeBeforeUpdate = auftragPositionenRepository.findAll().size();
        auftragPositionen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuftragPositionenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(auftragPositionen))
            )
            .andExpect(status().isBadRequest());

        // Validate the AuftragPositionen in the database
        List<AuftragPositionen> auftragPositionenList = auftragPositionenRepository.findAll();
        assertThat(auftragPositionenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAuftragPositionen() throws Exception {
        int databaseSizeBeforeUpdate = auftragPositionenRepository.findAll().size();
        auftragPositionen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuftragPositionenMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(auftragPositionen))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AuftragPositionen in the database
        List<AuftragPositionen> auftragPositionenList = auftragPositionenRepository.findAll();
        assertThat(auftragPositionenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAuftragPositionenWithPatch() throws Exception {
        // Initialize the database
        auftragPositionenRepository.saveAndFlush(auftragPositionen);

        int databaseSizeBeforeUpdate = auftragPositionenRepository.findAll().size();

        // Update the auftragPositionen using partial update
        AuftragPositionen partialUpdatedAuftragPositionen = new AuftragPositionen();
        partialUpdatedAuftragPositionen.setId(auftragPositionen.getId());

        restAuftragPositionenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAuftragPositionen.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAuftragPositionen))
            )
            .andExpect(status().isOk());

        // Validate the AuftragPositionen in the database
        List<AuftragPositionen> auftragPositionenList = auftragPositionenRepository.findAll();
        assertThat(auftragPositionenList).hasSize(databaseSizeBeforeUpdate);
        AuftragPositionen testAuftragPositionen = auftragPositionenList.get(auftragPositionenList.size() - 1);
        assertThat(testAuftragPositionen.getMenge()).isEqualTo(DEFAULT_MENGE);
    }

    @Test
    @Transactional
    void fullUpdateAuftragPositionenWithPatch() throws Exception {
        // Initialize the database
        auftragPositionenRepository.saveAndFlush(auftragPositionen);

        int databaseSizeBeforeUpdate = auftragPositionenRepository.findAll().size();

        // Update the auftragPositionen using partial update
        AuftragPositionen partialUpdatedAuftragPositionen = new AuftragPositionen();
        partialUpdatedAuftragPositionen.setId(auftragPositionen.getId());

        partialUpdatedAuftragPositionen.menge(UPDATED_MENGE);

        restAuftragPositionenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAuftragPositionen.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAuftragPositionen))
            )
            .andExpect(status().isOk());

        // Validate the AuftragPositionen in the database
        List<AuftragPositionen> auftragPositionenList = auftragPositionenRepository.findAll();
        assertThat(auftragPositionenList).hasSize(databaseSizeBeforeUpdate);
        AuftragPositionen testAuftragPositionen = auftragPositionenList.get(auftragPositionenList.size() - 1);
        assertThat(testAuftragPositionen.getMenge()).isEqualTo(UPDATED_MENGE);
    }

    @Test
    @Transactional
    void patchNonExistingAuftragPositionen() throws Exception {
        int databaseSizeBeforeUpdate = auftragPositionenRepository.findAll().size();
        auftragPositionen.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAuftragPositionenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, auftragPositionen.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(auftragPositionen))
            )
            .andExpect(status().isBadRequest());

        // Validate the AuftragPositionen in the database
        List<AuftragPositionen> auftragPositionenList = auftragPositionenRepository.findAll();
        assertThat(auftragPositionenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAuftragPositionen() throws Exception {
        int databaseSizeBeforeUpdate = auftragPositionenRepository.findAll().size();
        auftragPositionen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuftragPositionenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(auftragPositionen))
            )
            .andExpect(status().isBadRequest());

        // Validate the AuftragPositionen in the database
        List<AuftragPositionen> auftragPositionenList = auftragPositionenRepository.findAll();
        assertThat(auftragPositionenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAuftragPositionen() throws Exception {
        int databaseSizeBeforeUpdate = auftragPositionenRepository.findAll().size();
        auftragPositionen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAuftragPositionenMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(auftragPositionen))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AuftragPositionen in the database
        List<AuftragPositionen> auftragPositionenList = auftragPositionenRepository.findAll();
        assertThat(auftragPositionenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAuftragPositionen() throws Exception {
        // Initialize the database
        auftragPositionenRepository.saveAndFlush(auftragPositionen);

        int databaseSizeBeforeDelete = auftragPositionenRepository.findAll().size();

        // Delete the auftragPositionen
        restAuftragPositionenMockMvc
            .perform(delete(ENTITY_API_URL_ID, auftragPositionen.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AuftragPositionen> auftragPositionenList = auftragPositionenRepository.findAll();
        assertThat(auftragPositionenList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
