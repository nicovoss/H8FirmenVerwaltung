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
import xyz.dulli.domain.Artikel;
import xyz.dulli.repository.ArtikelRepository;

/**
 * Integration tests for the {@link ArtikelResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ArtikelResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/artikels";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ArtikelRepository artikelRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restArtikelMockMvc;

    private Artikel artikel;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Artikel createEntity(EntityManager em) {
        Artikel artikel = new Artikel().name(DEFAULT_NAME);
        return artikel;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Artikel createUpdatedEntity(EntityManager em) {
        Artikel artikel = new Artikel().name(UPDATED_NAME);
        return artikel;
    }

    @BeforeEach
    public void initTest() {
        artikel = createEntity(em);
    }

    @Test
    @Transactional
    void createArtikel() throws Exception {
        int databaseSizeBeforeCreate = artikelRepository.findAll().size();
        // Create the Artikel
        restArtikelMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(artikel))
            )
            .andExpect(status().isCreated());

        // Validate the Artikel in the database
        List<Artikel> artikelList = artikelRepository.findAll();
        assertThat(artikelList).hasSize(databaseSizeBeforeCreate + 1);
        Artikel testArtikel = artikelList.get(artikelList.size() - 1);
        assertThat(testArtikel.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createArtikelWithExistingId() throws Exception {
        // Create the Artikel with an existing ID
        artikel.setId(1L);

        int databaseSizeBeforeCreate = artikelRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restArtikelMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(artikel))
            )
            .andExpect(status().isBadRequest());

        // Validate the Artikel in the database
        List<Artikel> artikelList = artikelRepository.findAll();
        assertThat(artikelList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllArtikels() throws Exception {
        // Initialize the database
        artikelRepository.saveAndFlush(artikel);

        // Get all the artikelList
        restArtikelMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(artikel.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getArtikel() throws Exception {
        // Initialize the database
        artikelRepository.saveAndFlush(artikel);

        // Get the artikel
        restArtikelMockMvc
            .perform(get(ENTITY_API_URL_ID, artikel.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(artikel.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingArtikel() throws Exception {
        // Get the artikel
        restArtikelMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewArtikel() throws Exception {
        // Initialize the database
        artikelRepository.saveAndFlush(artikel);

        int databaseSizeBeforeUpdate = artikelRepository.findAll().size();

        // Update the artikel
        Artikel updatedArtikel = artikelRepository.findById(artikel.getId()).get();
        // Disconnect from session so that the updates on updatedArtikel are not directly saved in db
        em.detach(updatedArtikel);
        updatedArtikel.name(UPDATED_NAME);

        restArtikelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedArtikel.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedArtikel))
            )
            .andExpect(status().isOk());

        // Validate the Artikel in the database
        List<Artikel> artikelList = artikelRepository.findAll();
        assertThat(artikelList).hasSize(databaseSizeBeforeUpdate);
        Artikel testArtikel = artikelList.get(artikelList.size() - 1);
        assertThat(testArtikel.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingArtikel() throws Exception {
        int databaseSizeBeforeUpdate = artikelRepository.findAll().size();
        artikel.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restArtikelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, artikel.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(artikel))
            )
            .andExpect(status().isBadRequest());

        // Validate the Artikel in the database
        List<Artikel> artikelList = artikelRepository.findAll();
        assertThat(artikelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchArtikel() throws Exception {
        int databaseSizeBeforeUpdate = artikelRepository.findAll().size();
        artikel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtikelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(artikel))
            )
            .andExpect(status().isBadRequest());

        // Validate the Artikel in the database
        List<Artikel> artikelList = artikelRepository.findAll();
        assertThat(artikelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamArtikel() throws Exception {
        int databaseSizeBeforeUpdate = artikelRepository.findAll().size();
        artikel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtikelMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(artikel))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Artikel in the database
        List<Artikel> artikelList = artikelRepository.findAll();
        assertThat(artikelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateArtikelWithPatch() throws Exception {
        // Initialize the database
        artikelRepository.saveAndFlush(artikel);

        int databaseSizeBeforeUpdate = artikelRepository.findAll().size();

        // Update the artikel using partial update
        Artikel partialUpdatedArtikel = new Artikel();
        partialUpdatedArtikel.setId(artikel.getId());

        restArtikelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedArtikel.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedArtikel))
            )
            .andExpect(status().isOk());

        // Validate the Artikel in the database
        List<Artikel> artikelList = artikelRepository.findAll();
        assertThat(artikelList).hasSize(databaseSizeBeforeUpdate);
        Artikel testArtikel = artikelList.get(artikelList.size() - 1);
        assertThat(testArtikel.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateArtikelWithPatch() throws Exception {
        // Initialize the database
        artikelRepository.saveAndFlush(artikel);

        int databaseSizeBeforeUpdate = artikelRepository.findAll().size();

        // Update the artikel using partial update
        Artikel partialUpdatedArtikel = new Artikel();
        partialUpdatedArtikel.setId(artikel.getId());

        partialUpdatedArtikel.name(UPDATED_NAME);

        restArtikelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedArtikel.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedArtikel))
            )
            .andExpect(status().isOk());

        // Validate the Artikel in the database
        List<Artikel> artikelList = artikelRepository.findAll();
        assertThat(artikelList).hasSize(databaseSizeBeforeUpdate);
        Artikel testArtikel = artikelList.get(artikelList.size() - 1);
        assertThat(testArtikel.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingArtikel() throws Exception {
        int databaseSizeBeforeUpdate = artikelRepository.findAll().size();
        artikel.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restArtikelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, artikel.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(artikel))
            )
            .andExpect(status().isBadRequest());

        // Validate the Artikel in the database
        List<Artikel> artikelList = artikelRepository.findAll();
        assertThat(artikelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchArtikel() throws Exception {
        int databaseSizeBeforeUpdate = artikelRepository.findAll().size();
        artikel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtikelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(artikel))
            )
            .andExpect(status().isBadRequest());

        // Validate the Artikel in the database
        List<Artikel> artikelList = artikelRepository.findAll();
        assertThat(artikelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamArtikel() throws Exception {
        int databaseSizeBeforeUpdate = artikelRepository.findAll().size();
        artikel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtikelMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(artikel))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Artikel in the database
        List<Artikel> artikelList = artikelRepository.findAll();
        assertThat(artikelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteArtikel() throws Exception {
        // Initialize the database
        artikelRepository.saveAndFlush(artikel);

        int databaseSizeBeforeDelete = artikelRepository.findAll().size();

        // Delete the artikel
        restArtikelMockMvc
            .perform(delete(ENTITY_API_URL_ID, artikel.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Artikel> artikelList = artikelRepository.findAll();
        assertThat(artikelList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
