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
import xyz.dulli.domain.Bediener;
import xyz.dulli.repository.BedienerRepository;

/**
 * Integration tests for the {@link BedienerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BedienerResourceIT {

    private static final String DEFAULT_VNAME = "AAAAAAAAAA";
    private static final String UPDATED_VNAME = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/bedieners";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BedienerRepository bedienerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBedienerMockMvc;

    private Bediener bediener;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bediener createEntity(EntityManager em) {
        Bediener bediener = new Bediener().vname(DEFAULT_VNAME).name(DEFAULT_NAME);
        return bediener;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bediener createUpdatedEntity(EntityManager em) {
        Bediener bediener = new Bediener().vname(UPDATED_VNAME).name(UPDATED_NAME);
        return bediener;
    }

    @BeforeEach
    public void initTest() {
        bediener = createEntity(em);
    }

    @Test
    @Transactional
    void createBediener() throws Exception {
        int databaseSizeBeforeCreate = bedienerRepository.findAll().size();
        // Create the Bediener
        restBedienerMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bediener))
            )
            .andExpect(status().isCreated());

        // Validate the Bediener in the database
        List<Bediener> bedienerList = bedienerRepository.findAll();
        assertThat(bedienerList).hasSize(databaseSizeBeforeCreate + 1);
        Bediener testBediener = bedienerList.get(bedienerList.size() - 1);
        assertThat(testBediener.getVname()).isEqualTo(DEFAULT_VNAME);
        assertThat(testBediener.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createBedienerWithExistingId() throws Exception {
        // Create the Bediener with an existing ID
        bediener.setId(1L);

        int databaseSizeBeforeCreate = bedienerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBedienerMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bediener))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bediener in the database
        List<Bediener> bedienerList = bedienerRepository.findAll();
        assertThat(bedienerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBedieners() throws Exception {
        // Initialize the database
        bedienerRepository.saveAndFlush(bediener);

        // Get all the bedienerList
        restBedienerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bediener.getId().intValue())))
            .andExpect(jsonPath("$.[*].vname").value(hasItem(DEFAULT_VNAME)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getBediener() throws Exception {
        // Initialize the database
        bedienerRepository.saveAndFlush(bediener);

        // Get the bediener
        restBedienerMockMvc
            .perform(get(ENTITY_API_URL_ID, bediener.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bediener.getId().intValue()))
            .andExpect(jsonPath("$.vname").value(DEFAULT_VNAME))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingBediener() throws Exception {
        // Get the bediener
        restBedienerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBediener() throws Exception {
        // Initialize the database
        bedienerRepository.saveAndFlush(bediener);

        int databaseSizeBeforeUpdate = bedienerRepository.findAll().size();

        // Update the bediener
        Bediener updatedBediener = bedienerRepository.findById(bediener.getId()).get();
        // Disconnect from session so that the updates on updatedBediener are not directly saved in db
        em.detach(updatedBediener);
        updatedBediener.vname(UPDATED_VNAME).name(UPDATED_NAME);

        restBedienerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBediener.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBediener))
            )
            .andExpect(status().isOk());

        // Validate the Bediener in the database
        List<Bediener> bedienerList = bedienerRepository.findAll();
        assertThat(bedienerList).hasSize(databaseSizeBeforeUpdate);
        Bediener testBediener = bedienerList.get(bedienerList.size() - 1);
        assertThat(testBediener.getVname()).isEqualTo(UPDATED_VNAME);
        assertThat(testBediener.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingBediener() throws Exception {
        int databaseSizeBeforeUpdate = bedienerRepository.findAll().size();
        bediener.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBedienerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bediener.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bediener))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bediener in the database
        List<Bediener> bedienerList = bedienerRepository.findAll();
        assertThat(bedienerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBediener() throws Exception {
        int databaseSizeBeforeUpdate = bedienerRepository.findAll().size();
        bediener.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBedienerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bediener))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bediener in the database
        List<Bediener> bedienerList = bedienerRepository.findAll();
        assertThat(bedienerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBediener() throws Exception {
        int databaseSizeBeforeUpdate = bedienerRepository.findAll().size();
        bediener.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBedienerMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bediener))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bediener in the database
        List<Bediener> bedienerList = bedienerRepository.findAll();
        assertThat(bedienerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBedienerWithPatch() throws Exception {
        // Initialize the database
        bedienerRepository.saveAndFlush(bediener);

        int databaseSizeBeforeUpdate = bedienerRepository.findAll().size();

        // Update the bediener using partial update
        Bediener partialUpdatedBediener = new Bediener();
        partialUpdatedBediener.setId(bediener.getId());

        partialUpdatedBediener.name(UPDATED_NAME);

        restBedienerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBediener.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBediener))
            )
            .andExpect(status().isOk());

        // Validate the Bediener in the database
        List<Bediener> bedienerList = bedienerRepository.findAll();
        assertThat(bedienerList).hasSize(databaseSizeBeforeUpdate);
        Bediener testBediener = bedienerList.get(bedienerList.size() - 1);
        assertThat(testBediener.getVname()).isEqualTo(DEFAULT_VNAME);
        assertThat(testBediener.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateBedienerWithPatch() throws Exception {
        // Initialize the database
        bedienerRepository.saveAndFlush(bediener);

        int databaseSizeBeforeUpdate = bedienerRepository.findAll().size();

        // Update the bediener using partial update
        Bediener partialUpdatedBediener = new Bediener();
        partialUpdatedBediener.setId(bediener.getId());

        partialUpdatedBediener.vname(UPDATED_VNAME).name(UPDATED_NAME);

        restBedienerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBediener.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBediener))
            )
            .andExpect(status().isOk());

        // Validate the Bediener in the database
        List<Bediener> bedienerList = bedienerRepository.findAll();
        assertThat(bedienerList).hasSize(databaseSizeBeforeUpdate);
        Bediener testBediener = bedienerList.get(bedienerList.size() - 1);
        assertThat(testBediener.getVname()).isEqualTo(UPDATED_VNAME);
        assertThat(testBediener.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingBediener() throws Exception {
        int databaseSizeBeforeUpdate = bedienerRepository.findAll().size();
        bediener.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBedienerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bediener.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bediener))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bediener in the database
        List<Bediener> bedienerList = bedienerRepository.findAll();
        assertThat(bedienerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBediener() throws Exception {
        int databaseSizeBeforeUpdate = bedienerRepository.findAll().size();
        bediener.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBedienerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bediener))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bediener in the database
        List<Bediener> bedienerList = bedienerRepository.findAll();
        assertThat(bedienerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBediener() throws Exception {
        int databaseSizeBeforeUpdate = bedienerRepository.findAll().size();
        bediener.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBedienerMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bediener))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bediener in the database
        List<Bediener> bedienerList = bedienerRepository.findAll();
        assertThat(bedienerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBediener() throws Exception {
        // Initialize the database
        bedienerRepository.saveAndFlush(bediener);

        int databaseSizeBeforeDelete = bedienerRepository.findAll().size();

        // Delete the bediener
        restBedienerMockMvc
            .perform(delete(ENTITY_API_URL_ID, bediener.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bediener> bedienerList = bedienerRepository.findAll();
        assertThat(bedienerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
