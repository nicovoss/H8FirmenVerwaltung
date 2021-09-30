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
import xyz.dulli.domain.Rohstoff;
import xyz.dulli.repository.RohstoffRepository;

/**
 * Integration tests for the {@link RohstoffResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RohstoffResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_PREIS = 1;
    private static final Integer UPDATED_PREIS = 2;

    private static final String ENTITY_API_URL = "/api/rohstoffs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RohstoffRepository rohstoffRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRohstoffMockMvc;

    private Rohstoff rohstoff;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Rohstoff createEntity(EntityManager em) {
        Rohstoff rohstoff = new Rohstoff().name(DEFAULT_NAME).preis(DEFAULT_PREIS);
        return rohstoff;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Rohstoff createUpdatedEntity(EntityManager em) {
        Rohstoff rohstoff = new Rohstoff().name(UPDATED_NAME).preis(UPDATED_PREIS);
        return rohstoff;
    }

    @BeforeEach
    public void initTest() {
        rohstoff = createEntity(em);
    }

    @Test
    @Transactional
    void createRohstoff() throws Exception {
        int databaseSizeBeforeCreate = rohstoffRepository.findAll().size();
        // Create the Rohstoff
        restRohstoffMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rohstoff))
            )
            .andExpect(status().isCreated());

        // Validate the Rohstoff in the database
        List<Rohstoff> rohstoffList = rohstoffRepository.findAll();
        assertThat(rohstoffList).hasSize(databaseSizeBeforeCreate + 1);
        Rohstoff testRohstoff = rohstoffList.get(rohstoffList.size() - 1);
        assertThat(testRohstoff.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testRohstoff.getPreis()).isEqualTo(DEFAULT_PREIS);
    }

    @Test
    @Transactional
    void createRohstoffWithExistingId() throws Exception {
        // Create the Rohstoff with an existing ID
        rohstoff.setId(1L);

        int databaseSizeBeforeCreate = rohstoffRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRohstoffMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rohstoff))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rohstoff in the database
        List<Rohstoff> rohstoffList = rohstoffRepository.findAll();
        assertThat(rohstoffList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRohstoffs() throws Exception {
        // Initialize the database
        rohstoffRepository.saveAndFlush(rohstoff);

        // Get all the rohstoffList
        restRohstoffMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rohstoff.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].preis").value(hasItem(DEFAULT_PREIS)));
    }

    @Test
    @Transactional
    void getRohstoff() throws Exception {
        // Initialize the database
        rohstoffRepository.saveAndFlush(rohstoff);

        // Get the rohstoff
        restRohstoffMockMvc
            .perform(get(ENTITY_API_URL_ID, rohstoff.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rohstoff.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.preis").value(DEFAULT_PREIS));
    }

    @Test
    @Transactional
    void getNonExistingRohstoff() throws Exception {
        // Get the rohstoff
        restRohstoffMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRohstoff() throws Exception {
        // Initialize the database
        rohstoffRepository.saveAndFlush(rohstoff);

        int databaseSizeBeforeUpdate = rohstoffRepository.findAll().size();

        // Update the rohstoff
        Rohstoff updatedRohstoff = rohstoffRepository.findById(rohstoff.getId()).get();
        // Disconnect from session so that the updates on updatedRohstoff are not directly saved in db
        em.detach(updatedRohstoff);
        updatedRohstoff.name(UPDATED_NAME).preis(UPDATED_PREIS);

        restRohstoffMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRohstoff.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRohstoff))
            )
            .andExpect(status().isOk());

        // Validate the Rohstoff in the database
        List<Rohstoff> rohstoffList = rohstoffRepository.findAll();
        assertThat(rohstoffList).hasSize(databaseSizeBeforeUpdate);
        Rohstoff testRohstoff = rohstoffList.get(rohstoffList.size() - 1);
        assertThat(testRohstoff.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testRohstoff.getPreis()).isEqualTo(UPDATED_PREIS);
    }

    @Test
    @Transactional
    void putNonExistingRohstoff() throws Exception {
        int databaseSizeBeforeUpdate = rohstoffRepository.findAll().size();
        rohstoff.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRohstoffMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rohstoff.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rohstoff))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rohstoff in the database
        List<Rohstoff> rohstoffList = rohstoffRepository.findAll();
        assertThat(rohstoffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRohstoff() throws Exception {
        int databaseSizeBeforeUpdate = rohstoffRepository.findAll().size();
        rohstoff.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRohstoffMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rohstoff))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rohstoff in the database
        List<Rohstoff> rohstoffList = rohstoffRepository.findAll();
        assertThat(rohstoffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRohstoff() throws Exception {
        int databaseSizeBeforeUpdate = rohstoffRepository.findAll().size();
        rohstoff.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRohstoffMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rohstoff))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Rohstoff in the database
        List<Rohstoff> rohstoffList = rohstoffRepository.findAll();
        assertThat(rohstoffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRohstoffWithPatch() throws Exception {
        // Initialize the database
        rohstoffRepository.saveAndFlush(rohstoff);

        int databaseSizeBeforeUpdate = rohstoffRepository.findAll().size();

        // Update the rohstoff using partial update
        Rohstoff partialUpdatedRohstoff = new Rohstoff();
        partialUpdatedRohstoff.setId(rohstoff.getId());

        partialUpdatedRohstoff.preis(UPDATED_PREIS);

        restRohstoffMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRohstoff.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRohstoff))
            )
            .andExpect(status().isOk());

        // Validate the Rohstoff in the database
        List<Rohstoff> rohstoffList = rohstoffRepository.findAll();
        assertThat(rohstoffList).hasSize(databaseSizeBeforeUpdate);
        Rohstoff testRohstoff = rohstoffList.get(rohstoffList.size() - 1);
        assertThat(testRohstoff.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testRohstoff.getPreis()).isEqualTo(UPDATED_PREIS);
    }

    @Test
    @Transactional
    void fullUpdateRohstoffWithPatch() throws Exception {
        // Initialize the database
        rohstoffRepository.saveAndFlush(rohstoff);

        int databaseSizeBeforeUpdate = rohstoffRepository.findAll().size();

        // Update the rohstoff using partial update
        Rohstoff partialUpdatedRohstoff = new Rohstoff();
        partialUpdatedRohstoff.setId(rohstoff.getId());

        partialUpdatedRohstoff.name(UPDATED_NAME).preis(UPDATED_PREIS);

        restRohstoffMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRohstoff.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRohstoff))
            )
            .andExpect(status().isOk());

        // Validate the Rohstoff in the database
        List<Rohstoff> rohstoffList = rohstoffRepository.findAll();
        assertThat(rohstoffList).hasSize(databaseSizeBeforeUpdate);
        Rohstoff testRohstoff = rohstoffList.get(rohstoffList.size() - 1);
        assertThat(testRohstoff.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testRohstoff.getPreis()).isEqualTo(UPDATED_PREIS);
    }

    @Test
    @Transactional
    void patchNonExistingRohstoff() throws Exception {
        int databaseSizeBeforeUpdate = rohstoffRepository.findAll().size();
        rohstoff.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRohstoffMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, rohstoff.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rohstoff))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rohstoff in the database
        List<Rohstoff> rohstoffList = rohstoffRepository.findAll();
        assertThat(rohstoffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRohstoff() throws Exception {
        int databaseSizeBeforeUpdate = rohstoffRepository.findAll().size();
        rohstoff.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRohstoffMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rohstoff))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rohstoff in the database
        List<Rohstoff> rohstoffList = rohstoffRepository.findAll();
        assertThat(rohstoffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRohstoff() throws Exception {
        int databaseSizeBeforeUpdate = rohstoffRepository.findAll().size();
        rohstoff.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRohstoffMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rohstoff))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Rohstoff in the database
        List<Rohstoff> rohstoffList = rohstoffRepository.findAll();
        assertThat(rohstoffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRohstoff() throws Exception {
        // Initialize the database
        rohstoffRepository.saveAndFlush(rohstoff);

        int databaseSizeBeforeDelete = rohstoffRepository.findAll().size();

        // Delete the rohstoff
        restRohstoffMockMvc
            .perform(delete(ENTITY_API_URL_ID, rohstoff.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Rohstoff> rohstoffList = rohstoffRepository.findAll();
        assertThat(rohstoffList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
