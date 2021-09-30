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
import xyz.dulli.domain.ArtikelTyp;
import xyz.dulli.repository.ArtikelTypRepository;

/**
 * Integration tests for the {@link ArtikelTypResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ArtikelTypResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/artikel-typs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ArtikelTypRepository artikelTypRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restArtikelTypMockMvc;

    private ArtikelTyp artikelTyp;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ArtikelTyp createEntity(EntityManager em) {
        ArtikelTyp artikelTyp = new ArtikelTyp().name(DEFAULT_NAME);
        return artikelTyp;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ArtikelTyp createUpdatedEntity(EntityManager em) {
        ArtikelTyp artikelTyp = new ArtikelTyp().name(UPDATED_NAME);
        return artikelTyp;
    }

    @BeforeEach
    public void initTest() {
        artikelTyp = createEntity(em);
    }

    @Test
    @Transactional
    void createArtikelTyp() throws Exception {
        int databaseSizeBeforeCreate = artikelTypRepository.findAll().size();
        // Create the ArtikelTyp
        restArtikelTypMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(artikelTyp))
            )
            .andExpect(status().isCreated());

        // Validate the ArtikelTyp in the database
        List<ArtikelTyp> artikelTypList = artikelTypRepository.findAll();
        assertThat(artikelTypList).hasSize(databaseSizeBeforeCreate + 1);
        ArtikelTyp testArtikelTyp = artikelTypList.get(artikelTypList.size() - 1);
        assertThat(testArtikelTyp.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createArtikelTypWithExistingId() throws Exception {
        // Create the ArtikelTyp with an existing ID
        artikelTyp.setId(1L);

        int databaseSizeBeforeCreate = artikelTypRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restArtikelTypMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(artikelTyp))
            )
            .andExpect(status().isBadRequest());

        // Validate the ArtikelTyp in the database
        List<ArtikelTyp> artikelTypList = artikelTypRepository.findAll();
        assertThat(artikelTypList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllArtikelTyps() throws Exception {
        // Initialize the database
        artikelTypRepository.saveAndFlush(artikelTyp);

        // Get all the artikelTypList
        restArtikelTypMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(artikelTyp.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getArtikelTyp() throws Exception {
        // Initialize the database
        artikelTypRepository.saveAndFlush(artikelTyp);

        // Get the artikelTyp
        restArtikelTypMockMvc
            .perform(get(ENTITY_API_URL_ID, artikelTyp.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(artikelTyp.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingArtikelTyp() throws Exception {
        // Get the artikelTyp
        restArtikelTypMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewArtikelTyp() throws Exception {
        // Initialize the database
        artikelTypRepository.saveAndFlush(artikelTyp);

        int databaseSizeBeforeUpdate = artikelTypRepository.findAll().size();

        // Update the artikelTyp
        ArtikelTyp updatedArtikelTyp = artikelTypRepository.findById(artikelTyp.getId()).get();
        // Disconnect from session so that the updates on updatedArtikelTyp are not directly saved in db
        em.detach(updatedArtikelTyp);
        updatedArtikelTyp.name(UPDATED_NAME);

        restArtikelTypMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedArtikelTyp.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedArtikelTyp))
            )
            .andExpect(status().isOk());

        // Validate the ArtikelTyp in the database
        List<ArtikelTyp> artikelTypList = artikelTypRepository.findAll();
        assertThat(artikelTypList).hasSize(databaseSizeBeforeUpdate);
        ArtikelTyp testArtikelTyp = artikelTypList.get(artikelTypList.size() - 1);
        assertThat(testArtikelTyp.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingArtikelTyp() throws Exception {
        int databaseSizeBeforeUpdate = artikelTypRepository.findAll().size();
        artikelTyp.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restArtikelTypMockMvc
            .perform(
                put(ENTITY_API_URL_ID, artikelTyp.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(artikelTyp))
            )
            .andExpect(status().isBadRequest());

        // Validate the ArtikelTyp in the database
        List<ArtikelTyp> artikelTypList = artikelTypRepository.findAll();
        assertThat(artikelTypList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchArtikelTyp() throws Exception {
        int databaseSizeBeforeUpdate = artikelTypRepository.findAll().size();
        artikelTyp.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtikelTypMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(artikelTyp))
            )
            .andExpect(status().isBadRequest());

        // Validate the ArtikelTyp in the database
        List<ArtikelTyp> artikelTypList = artikelTypRepository.findAll();
        assertThat(artikelTypList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamArtikelTyp() throws Exception {
        int databaseSizeBeforeUpdate = artikelTypRepository.findAll().size();
        artikelTyp.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtikelTypMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(artikelTyp))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ArtikelTyp in the database
        List<ArtikelTyp> artikelTypList = artikelTypRepository.findAll();
        assertThat(artikelTypList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateArtikelTypWithPatch() throws Exception {
        // Initialize the database
        artikelTypRepository.saveAndFlush(artikelTyp);

        int databaseSizeBeforeUpdate = artikelTypRepository.findAll().size();

        // Update the artikelTyp using partial update
        ArtikelTyp partialUpdatedArtikelTyp = new ArtikelTyp();
        partialUpdatedArtikelTyp.setId(artikelTyp.getId());

        partialUpdatedArtikelTyp.name(UPDATED_NAME);

        restArtikelTypMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedArtikelTyp.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedArtikelTyp))
            )
            .andExpect(status().isOk());

        // Validate the ArtikelTyp in the database
        List<ArtikelTyp> artikelTypList = artikelTypRepository.findAll();
        assertThat(artikelTypList).hasSize(databaseSizeBeforeUpdate);
        ArtikelTyp testArtikelTyp = artikelTypList.get(artikelTypList.size() - 1);
        assertThat(testArtikelTyp.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateArtikelTypWithPatch() throws Exception {
        // Initialize the database
        artikelTypRepository.saveAndFlush(artikelTyp);

        int databaseSizeBeforeUpdate = artikelTypRepository.findAll().size();

        // Update the artikelTyp using partial update
        ArtikelTyp partialUpdatedArtikelTyp = new ArtikelTyp();
        partialUpdatedArtikelTyp.setId(artikelTyp.getId());

        partialUpdatedArtikelTyp.name(UPDATED_NAME);

        restArtikelTypMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedArtikelTyp.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedArtikelTyp))
            )
            .andExpect(status().isOk());

        // Validate the ArtikelTyp in the database
        List<ArtikelTyp> artikelTypList = artikelTypRepository.findAll();
        assertThat(artikelTypList).hasSize(databaseSizeBeforeUpdate);
        ArtikelTyp testArtikelTyp = artikelTypList.get(artikelTypList.size() - 1);
        assertThat(testArtikelTyp.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingArtikelTyp() throws Exception {
        int databaseSizeBeforeUpdate = artikelTypRepository.findAll().size();
        artikelTyp.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restArtikelTypMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, artikelTyp.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(artikelTyp))
            )
            .andExpect(status().isBadRequest());

        // Validate the ArtikelTyp in the database
        List<ArtikelTyp> artikelTypList = artikelTypRepository.findAll();
        assertThat(artikelTypList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchArtikelTyp() throws Exception {
        int databaseSizeBeforeUpdate = artikelTypRepository.findAll().size();
        artikelTyp.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtikelTypMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(artikelTyp))
            )
            .andExpect(status().isBadRequest());

        // Validate the ArtikelTyp in the database
        List<ArtikelTyp> artikelTypList = artikelTypRepository.findAll();
        assertThat(artikelTypList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamArtikelTyp() throws Exception {
        int databaseSizeBeforeUpdate = artikelTypRepository.findAll().size();
        artikelTyp.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtikelTypMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(artikelTyp))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ArtikelTyp in the database
        List<ArtikelTyp> artikelTypList = artikelTypRepository.findAll();
        assertThat(artikelTypList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteArtikelTyp() throws Exception {
        // Initialize the database
        artikelTypRepository.saveAndFlush(artikelTyp);

        int databaseSizeBeforeDelete = artikelTypRepository.findAll().size();

        // Delete the artikelTyp
        restArtikelTypMockMvc
            .perform(delete(ENTITY_API_URL_ID, artikelTyp.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ArtikelTyp> artikelTypList = artikelTypRepository.findAll();
        assertThat(artikelTypList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
