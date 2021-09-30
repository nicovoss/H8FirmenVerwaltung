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
import xyz.dulli.domain.Patner;
import xyz.dulli.repository.PatnerRepository;

/**
 * Integration tests for the {@link PatnerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PatnerResourceIT {

    private static final String DEFAULT_VNAME = "AAAAAAAAAA";
    private static final String UPDATED_VNAME = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/patners";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PatnerRepository patnerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPatnerMockMvc;

    private Patner patner;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Patner createEntity(EntityManager em) {
        Patner patner = new Patner().vname(DEFAULT_VNAME).name(DEFAULT_NAME);
        return patner;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Patner createUpdatedEntity(EntityManager em) {
        Patner patner = new Patner().vname(UPDATED_VNAME).name(UPDATED_NAME);
        return patner;
    }

    @BeforeEach
    public void initTest() {
        patner = createEntity(em);
    }

    @Test
    @Transactional
    void createPatner() throws Exception {
        int databaseSizeBeforeCreate = patnerRepository.findAll().size();
        // Create the Patner
        restPatnerMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patner))
            )
            .andExpect(status().isCreated());

        // Validate the Patner in the database
        List<Patner> patnerList = patnerRepository.findAll();
        assertThat(patnerList).hasSize(databaseSizeBeforeCreate + 1);
        Patner testPatner = patnerList.get(patnerList.size() - 1);
        assertThat(testPatner.getVname()).isEqualTo(DEFAULT_VNAME);
        assertThat(testPatner.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createPatnerWithExistingId() throws Exception {
        // Create the Patner with an existing ID
        patner.setId(1L);

        int databaseSizeBeforeCreate = patnerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPatnerMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patner))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patner in the database
        List<Patner> patnerList = patnerRepository.findAll();
        assertThat(patnerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPatners() throws Exception {
        // Initialize the database
        patnerRepository.saveAndFlush(patner);

        // Get all the patnerList
        restPatnerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(patner.getId().intValue())))
            .andExpect(jsonPath("$.[*].vname").value(hasItem(DEFAULT_VNAME)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getPatner() throws Exception {
        // Initialize the database
        patnerRepository.saveAndFlush(patner);

        // Get the patner
        restPatnerMockMvc
            .perform(get(ENTITY_API_URL_ID, patner.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(patner.getId().intValue()))
            .andExpect(jsonPath("$.vname").value(DEFAULT_VNAME))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingPatner() throws Exception {
        // Get the patner
        restPatnerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPatner() throws Exception {
        // Initialize the database
        patnerRepository.saveAndFlush(patner);

        int databaseSizeBeforeUpdate = patnerRepository.findAll().size();

        // Update the patner
        Patner updatedPatner = patnerRepository.findById(patner.getId()).get();
        // Disconnect from session so that the updates on updatedPatner are not directly saved in db
        em.detach(updatedPatner);
        updatedPatner.vname(UPDATED_VNAME).name(UPDATED_NAME);

        restPatnerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPatner.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPatner))
            )
            .andExpect(status().isOk());

        // Validate the Patner in the database
        List<Patner> patnerList = patnerRepository.findAll();
        assertThat(patnerList).hasSize(databaseSizeBeforeUpdate);
        Patner testPatner = patnerList.get(patnerList.size() - 1);
        assertThat(testPatner.getVname()).isEqualTo(UPDATED_VNAME);
        assertThat(testPatner.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingPatner() throws Exception {
        int databaseSizeBeforeUpdate = patnerRepository.findAll().size();
        patner.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPatnerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, patner.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(patner))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patner in the database
        List<Patner> patnerList = patnerRepository.findAll();
        assertThat(patnerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPatner() throws Exception {
        int databaseSizeBeforeUpdate = patnerRepository.findAll().size();
        patner.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatnerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(patner))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patner in the database
        List<Patner> patnerList = patnerRepository.findAll();
        assertThat(patnerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPatner() throws Exception {
        int databaseSizeBeforeUpdate = patnerRepository.findAll().size();
        patner.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatnerMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patner))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Patner in the database
        List<Patner> patnerList = patnerRepository.findAll();
        assertThat(patnerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePatnerWithPatch() throws Exception {
        // Initialize the database
        patnerRepository.saveAndFlush(patner);

        int databaseSizeBeforeUpdate = patnerRepository.findAll().size();

        // Update the patner using partial update
        Patner partialUpdatedPatner = new Patner();
        partialUpdatedPatner.setId(patner.getId());

        restPatnerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPatner.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPatner))
            )
            .andExpect(status().isOk());

        // Validate the Patner in the database
        List<Patner> patnerList = patnerRepository.findAll();
        assertThat(patnerList).hasSize(databaseSizeBeforeUpdate);
        Patner testPatner = patnerList.get(patnerList.size() - 1);
        assertThat(testPatner.getVname()).isEqualTo(DEFAULT_VNAME);
        assertThat(testPatner.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdatePatnerWithPatch() throws Exception {
        // Initialize the database
        patnerRepository.saveAndFlush(patner);

        int databaseSizeBeforeUpdate = patnerRepository.findAll().size();

        // Update the patner using partial update
        Patner partialUpdatedPatner = new Patner();
        partialUpdatedPatner.setId(patner.getId());

        partialUpdatedPatner.vname(UPDATED_VNAME).name(UPDATED_NAME);

        restPatnerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPatner.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPatner))
            )
            .andExpect(status().isOk());

        // Validate the Patner in the database
        List<Patner> patnerList = patnerRepository.findAll();
        assertThat(patnerList).hasSize(databaseSizeBeforeUpdate);
        Patner testPatner = patnerList.get(patnerList.size() - 1);
        assertThat(testPatner.getVname()).isEqualTo(UPDATED_VNAME);
        assertThat(testPatner.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingPatner() throws Exception {
        int databaseSizeBeforeUpdate = patnerRepository.findAll().size();
        patner.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPatnerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, patner.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(patner))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patner in the database
        List<Patner> patnerList = patnerRepository.findAll();
        assertThat(patnerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPatner() throws Exception {
        int databaseSizeBeforeUpdate = patnerRepository.findAll().size();
        patner.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatnerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(patner))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patner in the database
        List<Patner> patnerList = patnerRepository.findAll();
        assertThat(patnerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPatner() throws Exception {
        int databaseSizeBeforeUpdate = patnerRepository.findAll().size();
        patner.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatnerMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(patner))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Patner in the database
        List<Patner> patnerList = patnerRepository.findAll();
        assertThat(patnerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePatner() throws Exception {
        // Initialize the database
        patnerRepository.saveAndFlush(patner);

        int databaseSizeBeforeDelete = patnerRepository.findAll().size();

        // Delete the patner
        restPatnerMockMvc
            .perform(delete(ENTITY_API_URL_ID, patner.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Patner> patnerList = patnerRepository.findAll();
        assertThat(patnerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
