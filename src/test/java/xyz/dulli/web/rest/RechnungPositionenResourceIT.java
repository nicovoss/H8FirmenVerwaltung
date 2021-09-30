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
import xyz.dulli.domain.RechnungPositionen;
import xyz.dulli.repository.RechnungPositionenRepository;

/**
 * Integration tests for the {@link RechnungPositionenResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RechnungPositionenResourceIT {

    private static final String DEFAULT_ARTIKEL_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ARTIKEL_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ARTIKEL_BESCHREIBUNG = "AAAAAAAAAA";
    private static final String UPDATED_ARTIKEL_BESCHREIBUNG = "BBBBBBBBBB";

    private static final Integer DEFAULT_ARTIKEL_PREIS = 1;
    private static final Integer UPDATED_ARTIKEL_PREIS = 2;

    private static final Integer DEFAULT_MENGE = 1;
    private static final Integer UPDATED_MENGE = 2;

    private static final String ENTITY_API_URL = "/api/rechnung-positionens";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RechnungPositionenRepository rechnungPositionenRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRechnungPositionenMockMvc;

    private RechnungPositionen rechnungPositionen;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RechnungPositionen createEntity(EntityManager em) {
        RechnungPositionen rechnungPositionen = new RechnungPositionen()
            .artikelName(DEFAULT_ARTIKEL_NAME)
            .artikelBeschreibung(DEFAULT_ARTIKEL_BESCHREIBUNG)
            .artikelPreis(DEFAULT_ARTIKEL_PREIS)
            .menge(DEFAULT_MENGE);
        return rechnungPositionen;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RechnungPositionen createUpdatedEntity(EntityManager em) {
        RechnungPositionen rechnungPositionen = new RechnungPositionen()
            .artikelName(UPDATED_ARTIKEL_NAME)
            .artikelBeschreibung(UPDATED_ARTIKEL_BESCHREIBUNG)
            .artikelPreis(UPDATED_ARTIKEL_PREIS)
            .menge(UPDATED_MENGE);
        return rechnungPositionen;
    }

    @BeforeEach
    public void initTest() {
        rechnungPositionen = createEntity(em);
    }

    @Test
    @Transactional
    void createRechnungPositionen() throws Exception {
        int databaseSizeBeforeCreate = rechnungPositionenRepository.findAll().size();
        // Create the RechnungPositionen
        restRechnungPositionenMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rechnungPositionen))
            )
            .andExpect(status().isCreated());

        // Validate the RechnungPositionen in the database
        List<RechnungPositionen> rechnungPositionenList = rechnungPositionenRepository.findAll();
        assertThat(rechnungPositionenList).hasSize(databaseSizeBeforeCreate + 1);
        RechnungPositionen testRechnungPositionen = rechnungPositionenList.get(rechnungPositionenList.size() - 1);
        assertThat(testRechnungPositionen.getArtikelName()).isEqualTo(DEFAULT_ARTIKEL_NAME);
        assertThat(testRechnungPositionen.getArtikelBeschreibung()).isEqualTo(DEFAULT_ARTIKEL_BESCHREIBUNG);
        assertThat(testRechnungPositionen.getArtikelPreis()).isEqualTo(DEFAULT_ARTIKEL_PREIS);
        assertThat(testRechnungPositionen.getMenge()).isEqualTo(DEFAULT_MENGE);
    }

    @Test
    @Transactional
    void createRechnungPositionenWithExistingId() throws Exception {
        // Create the RechnungPositionen with an existing ID
        rechnungPositionen.setId(1L);

        int databaseSizeBeforeCreate = rechnungPositionenRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRechnungPositionenMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rechnungPositionen))
            )
            .andExpect(status().isBadRequest());

        // Validate the RechnungPositionen in the database
        List<RechnungPositionen> rechnungPositionenList = rechnungPositionenRepository.findAll();
        assertThat(rechnungPositionenList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkMengeIsRequired() throws Exception {
        int databaseSizeBeforeTest = rechnungPositionenRepository.findAll().size();
        // set the field null
        rechnungPositionen.setMenge(null);

        // Create the RechnungPositionen, which fails.

        restRechnungPositionenMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rechnungPositionen))
            )
            .andExpect(status().isBadRequest());

        List<RechnungPositionen> rechnungPositionenList = rechnungPositionenRepository.findAll();
        assertThat(rechnungPositionenList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRechnungPositionens() throws Exception {
        // Initialize the database
        rechnungPositionenRepository.saveAndFlush(rechnungPositionen);

        // Get all the rechnungPositionenList
        restRechnungPositionenMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rechnungPositionen.getId().intValue())))
            .andExpect(jsonPath("$.[*].artikelName").value(hasItem(DEFAULT_ARTIKEL_NAME)))
            .andExpect(jsonPath("$.[*].artikelBeschreibung").value(hasItem(DEFAULT_ARTIKEL_BESCHREIBUNG)))
            .andExpect(jsonPath("$.[*].artikelPreis").value(hasItem(DEFAULT_ARTIKEL_PREIS)))
            .andExpect(jsonPath("$.[*].menge").value(hasItem(DEFAULT_MENGE)));
    }

    @Test
    @Transactional
    void getRechnungPositionen() throws Exception {
        // Initialize the database
        rechnungPositionenRepository.saveAndFlush(rechnungPositionen);

        // Get the rechnungPositionen
        restRechnungPositionenMockMvc
            .perform(get(ENTITY_API_URL_ID, rechnungPositionen.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rechnungPositionen.getId().intValue()))
            .andExpect(jsonPath("$.artikelName").value(DEFAULT_ARTIKEL_NAME))
            .andExpect(jsonPath("$.artikelBeschreibung").value(DEFAULT_ARTIKEL_BESCHREIBUNG))
            .andExpect(jsonPath("$.artikelPreis").value(DEFAULT_ARTIKEL_PREIS))
            .andExpect(jsonPath("$.menge").value(DEFAULT_MENGE));
    }

    @Test
    @Transactional
    void getNonExistingRechnungPositionen() throws Exception {
        // Get the rechnungPositionen
        restRechnungPositionenMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRechnungPositionen() throws Exception {
        // Initialize the database
        rechnungPositionenRepository.saveAndFlush(rechnungPositionen);

        int databaseSizeBeforeUpdate = rechnungPositionenRepository.findAll().size();

        // Update the rechnungPositionen
        RechnungPositionen updatedRechnungPositionen = rechnungPositionenRepository.findById(rechnungPositionen.getId()).get();
        // Disconnect from session so that the updates on updatedRechnungPositionen are not directly saved in db
        em.detach(updatedRechnungPositionen);
        updatedRechnungPositionen
            .artikelName(UPDATED_ARTIKEL_NAME)
            .artikelBeschreibung(UPDATED_ARTIKEL_BESCHREIBUNG)
            .artikelPreis(UPDATED_ARTIKEL_PREIS)
            .menge(UPDATED_MENGE);

        restRechnungPositionenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRechnungPositionen.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRechnungPositionen))
            )
            .andExpect(status().isOk());

        // Validate the RechnungPositionen in the database
        List<RechnungPositionen> rechnungPositionenList = rechnungPositionenRepository.findAll();
        assertThat(rechnungPositionenList).hasSize(databaseSizeBeforeUpdate);
        RechnungPositionen testRechnungPositionen = rechnungPositionenList.get(rechnungPositionenList.size() - 1);
        assertThat(testRechnungPositionen.getArtikelName()).isEqualTo(UPDATED_ARTIKEL_NAME);
        assertThat(testRechnungPositionen.getArtikelBeschreibung()).isEqualTo(UPDATED_ARTIKEL_BESCHREIBUNG);
        assertThat(testRechnungPositionen.getArtikelPreis()).isEqualTo(UPDATED_ARTIKEL_PREIS);
        assertThat(testRechnungPositionen.getMenge()).isEqualTo(UPDATED_MENGE);
    }

    @Test
    @Transactional
    void putNonExistingRechnungPositionen() throws Exception {
        int databaseSizeBeforeUpdate = rechnungPositionenRepository.findAll().size();
        rechnungPositionen.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRechnungPositionenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rechnungPositionen.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rechnungPositionen))
            )
            .andExpect(status().isBadRequest());

        // Validate the RechnungPositionen in the database
        List<RechnungPositionen> rechnungPositionenList = rechnungPositionenRepository.findAll();
        assertThat(rechnungPositionenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRechnungPositionen() throws Exception {
        int databaseSizeBeforeUpdate = rechnungPositionenRepository.findAll().size();
        rechnungPositionen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRechnungPositionenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rechnungPositionen))
            )
            .andExpect(status().isBadRequest());

        // Validate the RechnungPositionen in the database
        List<RechnungPositionen> rechnungPositionenList = rechnungPositionenRepository.findAll();
        assertThat(rechnungPositionenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRechnungPositionen() throws Exception {
        int databaseSizeBeforeUpdate = rechnungPositionenRepository.findAll().size();
        rechnungPositionen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRechnungPositionenMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rechnungPositionen))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RechnungPositionen in the database
        List<RechnungPositionen> rechnungPositionenList = rechnungPositionenRepository.findAll();
        assertThat(rechnungPositionenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRechnungPositionenWithPatch() throws Exception {
        // Initialize the database
        rechnungPositionenRepository.saveAndFlush(rechnungPositionen);

        int databaseSizeBeforeUpdate = rechnungPositionenRepository.findAll().size();

        // Update the rechnungPositionen using partial update
        RechnungPositionen partialUpdatedRechnungPositionen = new RechnungPositionen();
        partialUpdatedRechnungPositionen.setId(rechnungPositionen.getId());

        partialUpdatedRechnungPositionen.artikelName(UPDATED_ARTIKEL_NAME).artikelPreis(UPDATED_ARTIKEL_PREIS).menge(UPDATED_MENGE);

        restRechnungPositionenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRechnungPositionen.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRechnungPositionen))
            )
            .andExpect(status().isOk());

        // Validate the RechnungPositionen in the database
        List<RechnungPositionen> rechnungPositionenList = rechnungPositionenRepository.findAll();
        assertThat(rechnungPositionenList).hasSize(databaseSizeBeforeUpdate);
        RechnungPositionen testRechnungPositionen = rechnungPositionenList.get(rechnungPositionenList.size() - 1);
        assertThat(testRechnungPositionen.getArtikelName()).isEqualTo(UPDATED_ARTIKEL_NAME);
        assertThat(testRechnungPositionen.getArtikelBeschreibung()).isEqualTo(DEFAULT_ARTIKEL_BESCHREIBUNG);
        assertThat(testRechnungPositionen.getArtikelPreis()).isEqualTo(UPDATED_ARTIKEL_PREIS);
        assertThat(testRechnungPositionen.getMenge()).isEqualTo(UPDATED_MENGE);
    }

    @Test
    @Transactional
    void fullUpdateRechnungPositionenWithPatch() throws Exception {
        // Initialize the database
        rechnungPositionenRepository.saveAndFlush(rechnungPositionen);

        int databaseSizeBeforeUpdate = rechnungPositionenRepository.findAll().size();

        // Update the rechnungPositionen using partial update
        RechnungPositionen partialUpdatedRechnungPositionen = new RechnungPositionen();
        partialUpdatedRechnungPositionen.setId(rechnungPositionen.getId());

        partialUpdatedRechnungPositionen
            .artikelName(UPDATED_ARTIKEL_NAME)
            .artikelBeschreibung(UPDATED_ARTIKEL_BESCHREIBUNG)
            .artikelPreis(UPDATED_ARTIKEL_PREIS)
            .menge(UPDATED_MENGE);

        restRechnungPositionenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRechnungPositionen.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRechnungPositionen))
            )
            .andExpect(status().isOk());

        // Validate the RechnungPositionen in the database
        List<RechnungPositionen> rechnungPositionenList = rechnungPositionenRepository.findAll();
        assertThat(rechnungPositionenList).hasSize(databaseSizeBeforeUpdate);
        RechnungPositionen testRechnungPositionen = rechnungPositionenList.get(rechnungPositionenList.size() - 1);
        assertThat(testRechnungPositionen.getArtikelName()).isEqualTo(UPDATED_ARTIKEL_NAME);
        assertThat(testRechnungPositionen.getArtikelBeschreibung()).isEqualTo(UPDATED_ARTIKEL_BESCHREIBUNG);
        assertThat(testRechnungPositionen.getArtikelPreis()).isEqualTo(UPDATED_ARTIKEL_PREIS);
        assertThat(testRechnungPositionen.getMenge()).isEqualTo(UPDATED_MENGE);
    }

    @Test
    @Transactional
    void patchNonExistingRechnungPositionen() throws Exception {
        int databaseSizeBeforeUpdate = rechnungPositionenRepository.findAll().size();
        rechnungPositionen.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRechnungPositionenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, rechnungPositionen.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rechnungPositionen))
            )
            .andExpect(status().isBadRequest());

        // Validate the RechnungPositionen in the database
        List<RechnungPositionen> rechnungPositionenList = rechnungPositionenRepository.findAll();
        assertThat(rechnungPositionenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRechnungPositionen() throws Exception {
        int databaseSizeBeforeUpdate = rechnungPositionenRepository.findAll().size();
        rechnungPositionen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRechnungPositionenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rechnungPositionen))
            )
            .andExpect(status().isBadRequest());

        // Validate the RechnungPositionen in the database
        List<RechnungPositionen> rechnungPositionenList = rechnungPositionenRepository.findAll();
        assertThat(rechnungPositionenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRechnungPositionen() throws Exception {
        int databaseSizeBeforeUpdate = rechnungPositionenRepository.findAll().size();
        rechnungPositionen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRechnungPositionenMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rechnungPositionen))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RechnungPositionen in the database
        List<RechnungPositionen> rechnungPositionenList = rechnungPositionenRepository.findAll();
        assertThat(rechnungPositionenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRechnungPositionen() throws Exception {
        // Initialize the database
        rechnungPositionenRepository.saveAndFlush(rechnungPositionen);

        int databaseSizeBeforeDelete = rechnungPositionenRepository.findAll().size();

        // Delete the rechnungPositionen
        restRechnungPositionenMockMvc
            .perform(delete(ENTITY_API_URL_ID, rechnungPositionen.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RechnungPositionen> rechnungPositionenList = rechnungPositionenRepository.findAll();
        assertThat(rechnungPositionenList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
