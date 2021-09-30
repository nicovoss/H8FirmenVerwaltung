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
import xyz.dulli.domain.ArtikelZuBauteilmenge;
import xyz.dulli.repository.ArtikelZuBauteilmengeRepository;

/**
 * Integration tests for the {@link ArtikelZuBauteilmengeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ArtikelZuBauteilmengeResourceIT {

    private static final Integer DEFAULT_MENGE = 1;
    private static final Integer UPDATED_MENGE = 2;

    private static final String ENTITY_API_URL = "/api/artikel-zu-bauteilmenges";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ArtikelZuBauteilmengeRepository artikelZuBauteilmengeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restArtikelZuBauteilmengeMockMvc;

    private ArtikelZuBauteilmenge artikelZuBauteilmenge;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ArtikelZuBauteilmenge createEntity(EntityManager em) {
        ArtikelZuBauteilmenge artikelZuBauteilmenge = new ArtikelZuBauteilmenge().menge(DEFAULT_MENGE);
        return artikelZuBauteilmenge;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ArtikelZuBauteilmenge createUpdatedEntity(EntityManager em) {
        ArtikelZuBauteilmenge artikelZuBauteilmenge = new ArtikelZuBauteilmenge().menge(UPDATED_MENGE);
        return artikelZuBauteilmenge;
    }

    @BeforeEach
    public void initTest() {
        artikelZuBauteilmenge = createEntity(em);
    }

    @Test
    @Transactional
    void createArtikelZuBauteilmenge() throws Exception {
        int databaseSizeBeforeCreate = artikelZuBauteilmengeRepository.findAll().size();
        // Create the ArtikelZuBauteilmenge
        restArtikelZuBauteilmengeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(artikelZuBauteilmenge))
            )
            .andExpect(status().isCreated());

        // Validate the ArtikelZuBauteilmenge in the database
        List<ArtikelZuBauteilmenge> artikelZuBauteilmengeList = artikelZuBauteilmengeRepository.findAll();
        assertThat(artikelZuBauteilmengeList).hasSize(databaseSizeBeforeCreate + 1);
        ArtikelZuBauteilmenge testArtikelZuBauteilmenge = artikelZuBauteilmengeList.get(artikelZuBauteilmengeList.size() - 1);
        assertThat(testArtikelZuBauteilmenge.getMenge()).isEqualTo(DEFAULT_MENGE);
    }

    @Test
    @Transactional
    void createArtikelZuBauteilmengeWithExistingId() throws Exception {
        // Create the ArtikelZuBauteilmenge with an existing ID
        artikelZuBauteilmenge.setId(1L);

        int databaseSizeBeforeCreate = artikelZuBauteilmengeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restArtikelZuBauteilmengeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(artikelZuBauteilmenge))
            )
            .andExpect(status().isBadRequest());

        // Validate the ArtikelZuBauteilmenge in the database
        List<ArtikelZuBauteilmenge> artikelZuBauteilmengeList = artikelZuBauteilmengeRepository.findAll();
        assertThat(artikelZuBauteilmengeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllArtikelZuBauteilmenges() throws Exception {
        // Initialize the database
        artikelZuBauteilmengeRepository.saveAndFlush(artikelZuBauteilmenge);

        // Get all the artikelZuBauteilmengeList
        restArtikelZuBauteilmengeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(artikelZuBauteilmenge.getId().intValue())))
            .andExpect(jsonPath("$.[*].menge").value(hasItem(DEFAULT_MENGE)));
    }

    @Test
    @Transactional
    void getArtikelZuBauteilmenge() throws Exception {
        // Initialize the database
        artikelZuBauteilmengeRepository.saveAndFlush(artikelZuBauteilmenge);

        // Get the artikelZuBauteilmenge
        restArtikelZuBauteilmengeMockMvc
            .perform(get(ENTITY_API_URL_ID, artikelZuBauteilmenge.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(artikelZuBauteilmenge.getId().intValue()))
            .andExpect(jsonPath("$.menge").value(DEFAULT_MENGE));
    }

    @Test
    @Transactional
    void getNonExistingArtikelZuBauteilmenge() throws Exception {
        // Get the artikelZuBauteilmenge
        restArtikelZuBauteilmengeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewArtikelZuBauteilmenge() throws Exception {
        // Initialize the database
        artikelZuBauteilmengeRepository.saveAndFlush(artikelZuBauteilmenge);

        int databaseSizeBeforeUpdate = artikelZuBauteilmengeRepository.findAll().size();

        // Update the artikelZuBauteilmenge
        ArtikelZuBauteilmenge updatedArtikelZuBauteilmenge = artikelZuBauteilmengeRepository.findById(artikelZuBauteilmenge.getId()).get();
        // Disconnect from session so that the updates on updatedArtikelZuBauteilmenge are not directly saved in db
        em.detach(updatedArtikelZuBauteilmenge);
        updatedArtikelZuBauteilmenge.menge(UPDATED_MENGE);

        restArtikelZuBauteilmengeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedArtikelZuBauteilmenge.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedArtikelZuBauteilmenge))
            )
            .andExpect(status().isOk());

        // Validate the ArtikelZuBauteilmenge in the database
        List<ArtikelZuBauteilmenge> artikelZuBauteilmengeList = artikelZuBauteilmengeRepository.findAll();
        assertThat(artikelZuBauteilmengeList).hasSize(databaseSizeBeforeUpdate);
        ArtikelZuBauteilmenge testArtikelZuBauteilmenge = artikelZuBauteilmengeList.get(artikelZuBauteilmengeList.size() - 1);
        assertThat(testArtikelZuBauteilmenge.getMenge()).isEqualTo(UPDATED_MENGE);
    }

    @Test
    @Transactional
    void putNonExistingArtikelZuBauteilmenge() throws Exception {
        int databaseSizeBeforeUpdate = artikelZuBauteilmengeRepository.findAll().size();
        artikelZuBauteilmenge.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restArtikelZuBauteilmengeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, artikelZuBauteilmenge.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(artikelZuBauteilmenge))
            )
            .andExpect(status().isBadRequest());

        // Validate the ArtikelZuBauteilmenge in the database
        List<ArtikelZuBauteilmenge> artikelZuBauteilmengeList = artikelZuBauteilmengeRepository.findAll();
        assertThat(artikelZuBauteilmengeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchArtikelZuBauteilmenge() throws Exception {
        int databaseSizeBeforeUpdate = artikelZuBauteilmengeRepository.findAll().size();
        artikelZuBauteilmenge.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtikelZuBauteilmengeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(artikelZuBauteilmenge))
            )
            .andExpect(status().isBadRequest());

        // Validate the ArtikelZuBauteilmenge in the database
        List<ArtikelZuBauteilmenge> artikelZuBauteilmengeList = artikelZuBauteilmengeRepository.findAll();
        assertThat(artikelZuBauteilmengeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamArtikelZuBauteilmenge() throws Exception {
        int databaseSizeBeforeUpdate = artikelZuBauteilmengeRepository.findAll().size();
        artikelZuBauteilmenge.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtikelZuBauteilmengeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(artikelZuBauteilmenge))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ArtikelZuBauteilmenge in the database
        List<ArtikelZuBauteilmenge> artikelZuBauteilmengeList = artikelZuBauteilmengeRepository.findAll();
        assertThat(artikelZuBauteilmengeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateArtikelZuBauteilmengeWithPatch() throws Exception {
        // Initialize the database
        artikelZuBauteilmengeRepository.saveAndFlush(artikelZuBauteilmenge);

        int databaseSizeBeforeUpdate = artikelZuBauteilmengeRepository.findAll().size();

        // Update the artikelZuBauteilmenge using partial update
        ArtikelZuBauteilmenge partialUpdatedArtikelZuBauteilmenge = new ArtikelZuBauteilmenge();
        partialUpdatedArtikelZuBauteilmenge.setId(artikelZuBauteilmenge.getId());

        partialUpdatedArtikelZuBauteilmenge.menge(UPDATED_MENGE);

        restArtikelZuBauteilmengeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedArtikelZuBauteilmenge.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedArtikelZuBauteilmenge))
            )
            .andExpect(status().isOk());

        // Validate the ArtikelZuBauteilmenge in the database
        List<ArtikelZuBauteilmenge> artikelZuBauteilmengeList = artikelZuBauteilmengeRepository.findAll();
        assertThat(artikelZuBauteilmengeList).hasSize(databaseSizeBeforeUpdate);
        ArtikelZuBauteilmenge testArtikelZuBauteilmenge = artikelZuBauteilmengeList.get(artikelZuBauteilmengeList.size() - 1);
        assertThat(testArtikelZuBauteilmenge.getMenge()).isEqualTo(UPDATED_MENGE);
    }

    @Test
    @Transactional
    void fullUpdateArtikelZuBauteilmengeWithPatch() throws Exception {
        // Initialize the database
        artikelZuBauteilmengeRepository.saveAndFlush(artikelZuBauteilmenge);

        int databaseSizeBeforeUpdate = artikelZuBauteilmengeRepository.findAll().size();

        // Update the artikelZuBauteilmenge using partial update
        ArtikelZuBauteilmenge partialUpdatedArtikelZuBauteilmenge = new ArtikelZuBauteilmenge();
        partialUpdatedArtikelZuBauteilmenge.setId(artikelZuBauteilmenge.getId());

        partialUpdatedArtikelZuBauteilmenge.menge(UPDATED_MENGE);

        restArtikelZuBauteilmengeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedArtikelZuBauteilmenge.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedArtikelZuBauteilmenge))
            )
            .andExpect(status().isOk());

        // Validate the ArtikelZuBauteilmenge in the database
        List<ArtikelZuBauteilmenge> artikelZuBauteilmengeList = artikelZuBauteilmengeRepository.findAll();
        assertThat(artikelZuBauteilmengeList).hasSize(databaseSizeBeforeUpdate);
        ArtikelZuBauteilmenge testArtikelZuBauteilmenge = artikelZuBauteilmengeList.get(artikelZuBauteilmengeList.size() - 1);
        assertThat(testArtikelZuBauteilmenge.getMenge()).isEqualTo(UPDATED_MENGE);
    }

    @Test
    @Transactional
    void patchNonExistingArtikelZuBauteilmenge() throws Exception {
        int databaseSizeBeforeUpdate = artikelZuBauteilmengeRepository.findAll().size();
        artikelZuBauteilmenge.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restArtikelZuBauteilmengeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, artikelZuBauteilmenge.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(artikelZuBauteilmenge))
            )
            .andExpect(status().isBadRequest());

        // Validate the ArtikelZuBauteilmenge in the database
        List<ArtikelZuBauteilmenge> artikelZuBauteilmengeList = artikelZuBauteilmengeRepository.findAll();
        assertThat(artikelZuBauteilmengeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchArtikelZuBauteilmenge() throws Exception {
        int databaseSizeBeforeUpdate = artikelZuBauteilmengeRepository.findAll().size();
        artikelZuBauteilmenge.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtikelZuBauteilmengeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(artikelZuBauteilmenge))
            )
            .andExpect(status().isBadRequest());

        // Validate the ArtikelZuBauteilmenge in the database
        List<ArtikelZuBauteilmenge> artikelZuBauteilmengeList = artikelZuBauteilmengeRepository.findAll();
        assertThat(artikelZuBauteilmengeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamArtikelZuBauteilmenge() throws Exception {
        int databaseSizeBeforeUpdate = artikelZuBauteilmengeRepository.findAll().size();
        artikelZuBauteilmenge.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtikelZuBauteilmengeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(artikelZuBauteilmenge))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ArtikelZuBauteilmenge in the database
        List<ArtikelZuBauteilmenge> artikelZuBauteilmengeList = artikelZuBauteilmengeRepository.findAll();
        assertThat(artikelZuBauteilmengeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteArtikelZuBauteilmenge() throws Exception {
        // Initialize the database
        artikelZuBauteilmengeRepository.saveAndFlush(artikelZuBauteilmenge);

        int databaseSizeBeforeDelete = artikelZuBauteilmengeRepository.findAll().size();

        // Delete the artikelZuBauteilmenge
        restArtikelZuBauteilmengeMockMvc
            .perform(delete(ENTITY_API_URL_ID, artikelZuBauteilmenge.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ArtikelZuBauteilmenge> artikelZuBauteilmengeList = artikelZuBauteilmengeRepository.findAll();
        assertThat(artikelZuBauteilmengeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
