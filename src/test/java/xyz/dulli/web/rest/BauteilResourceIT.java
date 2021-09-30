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
import xyz.dulli.domain.Bauteil;
import xyz.dulli.repository.BauteilRepository;

/**
 * Integration tests for the {@link BauteilResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BauteilResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/bauteils";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BauteilRepository bauteilRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBauteilMockMvc;

    private Bauteil bauteil;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bauteil createEntity(EntityManager em) {
        Bauteil bauteil = new Bauteil().name(DEFAULT_NAME);
        return bauteil;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bauteil createUpdatedEntity(EntityManager em) {
        Bauteil bauteil = new Bauteil().name(UPDATED_NAME);
        return bauteil;
    }

    @BeforeEach
    public void initTest() {
        bauteil = createEntity(em);
    }

    @Test
    @Transactional
    void createBauteil() throws Exception {
        int databaseSizeBeforeCreate = bauteilRepository.findAll().size();
        // Create the Bauteil
        restBauteilMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bauteil))
            )
            .andExpect(status().isCreated());

        // Validate the Bauteil in the database
        List<Bauteil> bauteilList = bauteilRepository.findAll();
        assertThat(bauteilList).hasSize(databaseSizeBeforeCreate + 1);
        Bauteil testBauteil = bauteilList.get(bauteilList.size() - 1);
        assertThat(testBauteil.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createBauteilWithExistingId() throws Exception {
        // Create the Bauteil with an existing ID
        bauteil.setId(1L);

        int databaseSizeBeforeCreate = bauteilRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBauteilMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bauteil))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bauteil in the database
        List<Bauteil> bauteilList = bauteilRepository.findAll();
        assertThat(bauteilList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBauteils() throws Exception {
        // Initialize the database
        bauteilRepository.saveAndFlush(bauteil);

        // Get all the bauteilList
        restBauteilMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bauteil.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getBauteil() throws Exception {
        // Initialize the database
        bauteilRepository.saveAndFlush(bauteil);

        // Get the bauteil
        restBauteilMockMvc
            .perform(get(ENTITY_API_URL_ID, bauteil.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bauteil.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingBauteil() throws Exception {
        // Get the bauteil
        restBauteilMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBauteil() throws Exception {
        // Initialize the database
        bauteilRepository.saveAndFlush(bauteil);

        int databaseSizeBeforeUpdate = bauteilRepository.findAll().size();

        // Update the bauteil
        Bauteil updatedBauteil = bauteilRepository.findById(bauteil.getId()).get();
        // Disconnect from session so that the updates on updatedBauteil are not directly saved in db
        em.detach(updatedBauteil);
        updatedBauteil.name(UPDATED_NAME);

        restBauteilMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBauteil.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBauteil))
            )
            .andExpect(status().isOk());

        // Validate the Bauteil in the database
        List<Bauteil> bauteilList = bauteilRepository.findAll();
        assertThat(bauteilList).hasSize(databaseSizeBeforeUpdate);
        Bauteil testBauteil = bauteilList.get(bauteilList.size() - 1);
        assertThat(testBauteil.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingBauteil() throws Exception {
        int databaseSizeBeforeUpdate = bauteilRepository.findAll().size();
        bauteil.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBauteilMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bauteil.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bauteil))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bauteil in the database
        List<Bauteil> bauteilList = bauteilRepository.findAll();
        assertThat(bauteilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBauteil() throws Exception {
        int databaseSizeBeforeUpdate = bauteilRepository.findAll().size();
        bauteil.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBauteilMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bauteil))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bauteil in the database
        List<Bauteil> bauteilList = bauteilRepository.findAll();
        assertThat(bauteilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBauteil() throws Exception {
        int databaseSizeBeforeUpdate = bauteilRepository.findAll().size();
        bauteil.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBauteilMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bauteil))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bauteil in the database
        List<Bauteil> bauteilList = bauteilRepository.findAll();
        assertThat(bauteilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBauteilWithPatch() throws Exception {
        // Initialize the database
        bauteilRepository.saveAndFlush(bauteil);

        int databaseSizeBeforeUpdate = bauteilRepository.findAll().size();

        // Update the bauteil using partial update
        Bauteil partialUpdatedBauteil = new Bauteil();
        partialUpdatedBauteil.setId(bauteil.getId());

        restBauteilMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBauteil.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBauteil))
            )
            .andExpect(status().isOk());

        // Validate the Bauteil in the database
        List<Bauteil> bauteilList = bauteilRepository.findAll();
        assertThat(bauteilList).hasSize(databaseSizeBeforeUpdate);
        Bauteil testBauteil = bauteilList.get(bauteilList.size() - 1);
        assertThat(testBauteil.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateBauteilWithPatch() throws Exception {
        // Initialize the database
        bauteilRepository.saveAndFlush(bauteil);

        int databaseSizeBeforeUpdate = bauteilRepository.findAll().size();

        // Update the bauteil using partial update
        Bauteil partialUpdatedBauteil = new Bauteil();
        partialUpdatedBauteil.setId(bauteil.getId());

        partialUpdatedBauteil.name(UPDATED_NAME);

        restBauteilMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBauteil.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBauteil))
            )
            .andExpect(status().isOk());

        // Validate the Bauteil in the database
        List<Bauteil> bauteilList = bauteilRepository.findAll();
        assertThat(bauteilList).hasSize(databaseSizeBeforeUpdate);
        Bauteil testBauteil = bauteilList.get(bauteilList.size() - 1);
        assertThat(testBauteil.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingBauteil() throws Exception {
        int databaseSizeBeforeUpdate = bauteilRepository.findAll().size();
        bauteil.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBauteilMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bauteil.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bauteil))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bauteil in the database
        List<Bauteil> bauteilList = bauteilRepository.findAll();
        assertThat(bauteilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBauteil() throws Exception {
        int databaseSizeBeforeUpdate = bauteilRepository.findAll().size();
        bauteil.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBauteilMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bauteil))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bauteil in the database
        List<Bauteil> bauteilList = bauteilRepository.findAll();
        assertThat(bauteilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBauteil() throws Exception {
        int databaseSizeBeforeUpdate = bauteilRepository.findAll().size();
        bauteil.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBauteilMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bauteil))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bauteil in the database
        List<Bauteil> bauteilList = bauteilRepository.findAll();
        assertThat(bauteilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBauteil() throws Exception {
        // Initialize the database
        bauteilRepository.saveAndFlush(bauteil);

        int databaseSizeBeforeDelete = bauteilRepository.findAll().size();

        // Delete the bauteil
        restBauteilMockMvc
            .perform(delete(ENTITY_API_URL_ID, bauteil.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bauteil> bauteilList = bauteilRepository.findAll();
        assertThat(bauteilList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
