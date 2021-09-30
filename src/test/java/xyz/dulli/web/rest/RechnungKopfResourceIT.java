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
import xyz.dulli.domain.RechnungKopf;
import xyz.dulli.repository.RechnungKopfRepository;

/**
 * Integration tests for the {@link RechnungKopfResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RechnungKopfResourceIT {

    private static final String ENTITY_API_URL = "/api/rechnung-kopfs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RechnungKopfRepository rechnungKopfRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRechnungKopfMockMvc;

    private RechnungKopf rechnungKopf;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RechnungKopf createEntity(EntityManager em) {
        RechnungKopf rechnungKopf = new RechnungKopf();
        return rechnungKopf;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RechnungKopf createUpdatedEntity(EntityManager em) {
        RechnungKopf rechnungKopf = new RechnungKopf();
        return rechnungKopf;
    }

    @BeforeEach
    public void initTest() {
        rechnungKopf = createEntity(em);
    }

    @Test
    @Transactional
    void createRechnungKopf() throws Exception {
        int databaseSizeBeforeCreate = rechnungKopfRepository.findAll().size();
        // Create the RechnungKopf
        restRechnungKopfMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rechnungKopf))
            )
            .andExpect(status().isCreated());

        // Validate the RechnungKopf in the database
        List<RechnungKopf> rechnungKopfList = rechnungKopfRepository.findAll();
        assertThat(rechnungKopfList).hasSize(databaseSizeBeforeCreate + 1);
        RechnungKopf testRechnungKopf = rechnungKopfList.get(rechnungKopfList.size() - 1);
    }

    @Test
    @Transactional
    void createRechnungKopfWithExistingId() throws Exception {
        // Create the RechnungKopf with an existing ID
        rechnungKopf.setId(1L);

        int databaseSizeBeforeCreate = rechnungKopfRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRechnungKopfMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rechnungKopf))
            )
            .andExpect(status().isBadRequest());

        // Validate the RechnungKopf in the database
        List<RechnungKopf> rechnungKopfList = rechnungKopfRepository.findAll();
        assertThat(rechnungKopfList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRechnungKopfs() throws Exception {
        // Initialize the database
        rechnungKopfRepository.saveAndFlush(rechnungKopf);

        // Get all the rechnungKopfList
        restRechnungKopfMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rechnungKopf.getId().intValue())));
    }

    @Test
    @Transactional
    void getRechnungKopf() throws Exception {
        // Initialize the database
        rechnungKopfRepository.saveAndFlush(rechnungKopf);

        // Get the rechnungKopf
        restRechnungKopfMockMvc
            .perform(get(ENTITY_API_URL_ID, rechnungKopf.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rechnungKopf.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingRechnungKopf() throws Exception {
        // Get the rechnungKopf
        restRechnungKopfMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRechnungKopf() throws Exception {
        // Initialize the database
        rechnungKopfRepository.saveAndFlush(rechnungKopf);

        int databaseSizeBeforeUpdate = rechnungKopfRepository.findAll().size();

        // Update the rechnungKopf
        RechnungKopf updatedRechnungKopf = rechnungKopfRepository.findById(rechnungKopf.getId()).get();
        // Disconnect from session so that the updates on updatedRechnungKopf are not directly saved in db
        em.detach(updatedRechnungKopf);

        restRechnungKopfMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRechnungKopf.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRechnungKopf))
            )
            .andExpect(status().isOk());

        // Validate the RechnungKopf in the database
        List<RechnungKopf> rechnungKopfList = rechnungKopfRepository.findAll();
        assertThat(rechnungKopfList).hasSize(databaseSizeBeforeUpdate);
        RechnungKopf testRechnungKopf = rechnungKopfList.get(rechnungKopfList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingRechnungKopf() throws Exception {
        int databaseSizeBeforeUpdate = rechnungKopfRepository.findAll().size();
        rechnungKopf.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRechnungKopfMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rechnungKopf.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rechnungKopf))
            )
            .andExpect(status().isBadRequest());

        // Validate the RechnungKopf in the database
        List<RechnungKopf> rechnungKopfList = rechnungKopfRepository.findAll();
        assertThat(rechnungKopfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRechnungKopf() throws Exception {
        int databaseSizeBeforeUpdate = rechnungKopfRepository.findAll().size();
        rechnungKopf.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRechnungKopfMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rechnungKopf))
            )
            .andExpect(status().isBadRequest());

        // Validate the RechnungKopf in the database
        List<RechnungKopf> rechnungKopfList = rechnungKopfRepository.findAll();
        assertThat(rechnungKopfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRechnungKopf() throws Exception {
        int databaseSizeBeforeUpdate = rechnungKopfRepository.findAll().size();
        rechnungKopf.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRechnungKopfMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rechnungKopf))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RechnungKopf in the database
        List<RechnungKopf> rechnungKopfList = rechnungKopfRepository.findAll();
        assertThat(rechnungKopfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRechnungKopfWithPatch() throws Exception {
        // Initialize the database
        rechnungKopfRepository.saveAndFlush(rechnungKopf);

        int databaseSizeBeforeUpdate = rechnungKopfRepository.findAll().size();

        // Update the rechnungKopf using partial update
        RechnungKopf partialUpdatedRechnungKopf = new RechnungKopf();
        partialUpdatedRechnungKopf.setId(rechnungKopf.getId());

        restRechnungKopfMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRechnungKopf.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRechnungKopf))
            )
            .andExpect(status().isOk());

        // Validate the RechnungKopf in the database
        List<RechnungKopf> rechnungKopfList = rechnungKopfRepository.findAll();
        assertThat(rechnungKopfList).hasSize(databaseSizeBeforeUpdate);
        RechnungKopf testRechnungKopf = rechnungKopfList.get(rechnungKopfList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateRechnungKopfWithPatch() throws Exception {
        // Initialize the database
        rechnungKopfRepository.saveAndFlush(rechnungKopf);

        int databaseSizeBeforeUpdate = rechnungKopfRepository.findAll().size();

        // Update the rechnungKopf using partial update
        RechnungKopf partialUpdatedRechnungKopf = new RechnungKopf();
        partialUpdatedRechnungKopf.setId(rechnungKopf.getId());

        restRechnungKopfMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRechnungKopf.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRechnungKopf))
            )
            .andExpect(status().isOk());

        // Validate the RechnungKopf in the database
        List<RechnungKopf> rechnungKopfList = rechnungKopfRepository.findAll();
        assertThat(rechnungKopfList).hasSize(databaseSizeBeforeUpdate);
        RechnungKopf testRechnungKopf = rechnungKopfList.get(rechnungKopfList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingRechnungKopf() throws Exception {
        int databaseSizeBeforeUpdate = rechnungKopfRepository.findAll().size();
        rechnungKopf.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRechnungKopfMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, rechnungKopf.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rechnungKopf))
            )
            .andExpect(status().isBadRequest());

        // Validate the RechnungKopf in the database
        List<RechnungKopf> rechnungKopfList = rechnungKopfRepository.findAll();
        assertThat(rechnungKopfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRechnungKopf() throws Exception {
        int databaseSizeBeforeUpdate = rechnungKopfRepository.findAll().size();
        rechnungKopf.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRechnungKopfMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rechnungKopf))
            )
            .andExpect(status().isBadRequest());

        // Validate the RechnungKopf in the database
        List<RechnungKopf> rechnungKopfList = rechnungKopfRepository.findAll();
        assertThat(rechnungKopfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRechnungKopf() throws Exception {
        int databaseSizeBeforeUpdate = rechnungKopfRepository.findAll().size();
        rechnungKopf.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRechnungKopfMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rechnungKopf))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RechnungKopf in the database
        List<RechnungKopf> rechnungKopfList = rechnungKopfRepository.findAll();
        assertThat(rechnungKopfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRechnungKopf() throws Exception {
        // Initialize the database
        rechnungKopfRepository.saveAndFlush(rechnungKopf);

        int databaseSizeBeforeDelete = rechnungKopfRepository.findAll().size();

        // Delete the rechnungKopf
        restRechnungKopfMockMvc
            .perform(delete(ENTITY_API_URL_ID, rechnungKopf.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RechnungKopf> rechnungKopfList = rechnungKopfRepository.findAll();
        assertThat(rechnungKopfList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
