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
import xyz.dulli.domain.BauteilGruppe;
import xyz.dulli.repository.BauteilGruppeRepository;

/**
 * Integration tests for the {@link BauteilGruppeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BauteilGruppeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/bauteil-gruppes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BauteilGruppeRepository bauteilGruppeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBauteilGruppeMockMvc;

    private BauteilGruppe bauteilGruppe;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BauteilGruppe createEntity(EntityManager em) {
        BauteilGruppe bauteilGruppe = new BauteilGruppe().name(DEFAULT_NAME);
        return bauteilGruppe;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BauteilGruppe createUpdatedEntity(EntityManager em) {
        BauteilGruppe bauteilGruppe = new BauteilGruppe().name(UPDATED_NAME);
        return bauteilGruppe;
    }

    @BeforeEach
    public void initTest() {
        bauteilGruppe = createEntity(em);
    }

    @Test
    @Transactional
    void createBauteilGruppe() throws Exception {
        int databaseSizeBeforeCreate = bauteilGruppeRepository.findAll().size();
        // Create the BauteilGruppe
        restBauteilGruppeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bauteilGruppe))
            )
            .andExpect(status().isCreated());

        // Validate the BauteilGruppe in the database
        List<BauteilGruppe> bauteilGruppeList = bauteilGruppeRepository.findAll();
        assertThat(bauteilGruppeList).hasSize(databaseSizeBeforeCreate + 1);
        BauteilGruppe testBauteilGruppe = bauteilGruppeList.get(bauteilGruppeList.size() - 1);
        assertThat(testBauteilGruppe.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createBauteilGruppeWithExistingId() throws Exception {
        // Create the BauteilGruppe with an existing ID
        bauteilGruppe.setId(1L);

        int databaseSizeBeforeCreate = bauteilGruppeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBauteilGruppeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bauteilGruppe))
            )
            .andExpect(status().isBadRequest());

        // Validate the BauteilGruppe in the database
        List<BauteilGruppe> bauteilGruppeList = bauteilGruppeRepository.findAll();
        assertThat(bauteilGruppeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBauteilGruppes() throws Exception {
        // Initialize the database
        bauteilGruppeRepository.saveAndFlush(bauteilGruppe);

        // Get all the bauteilGruppeList
        restBauteilGruppeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bauteilGruppe.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getBauteilGruppe() throws Exception {
        // Initialize the database
        bauteilGruppeRepository.saveAndFlush(bauteilGruppe);

        // Get the bauteilGruppe
        restBauteilGruppeMockMvc
            .perform(get(ENTITY_API_URL_ID, bauteilGruppe.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bauteilGruppe.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingBauteilGruppe() throws Exception {
        // Get the bauteilGruppe
        restBauteilGruppeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBauteilGruppe() throws Exception {
        // Initialize the database
        bauteilGruppeRepository.saveAndFlush(bauteilGruppe);

        int databaseSizeBeforeUpdate = bauteilGruppeRepository.findAll().size();

        // Update the bauteilGruppe
        BauteilGruppe updatedBauteilGruppe = bauteilGruppeRepository.findById(bauteilGruppe.getId()).get();
        // Disconnect from session so that the updates on updatedBauteilGruppe are not directly saved in db
        em.detach(updatedBauteilGruppe);
        updatedBauteilGruppe.name(UPDATED_NAME);

        restBauteilGruppeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBauteilGruppe.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBauteilGruppe))
            )
            .andExpect(status().isOk());

        // Validate the BauteilGruppe in the database
        List<BauteilGruppe> bauteilGruppeList = bauteilGruppeRepository.findAll();
        assertThat(bauteilGruppeList).hasSize(databaseSizeBeforeUpdate);
        BauteilGruppe testBauteilGruppe = bauteilGruppeList.get(bauteilGruppeList.size() - 1);
        assertThat(testBauteilGruppe.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingBauteilGruppe() throws Exception {
        int databaseSizeBeforeUpdate = bauteilGruppeRepository.findAll().size();
        bauteilGruppe.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBauteilGruppeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bauteilGruppe.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bauteilGruppe))
            )
            .andExpect(status().isBadRequest());

        // Validate the BauteilGruppe in the database
        List<BauteilGruppe> bauteilGruppeList = bauteilGruppeRepository.findAll();
        assertThat(bauteilGruppeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBauteilGruppe() throws Exception {
        int databaseSizeBeforeUpdate = bauteilGruppeRepository.findAll().size();
        bauteilGruppe.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBauteilGruppeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bauteilGruppe))
            )
            .andExpect(status().isBadRequest());

        // Validate the BauteilGruppe in the database
        List<BauteilGruppe> bauteilGruppeList = bauteilGruppeRepository.findAll();
        assertThat(bauteilGruppeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBauteilGruppe() throws Exception {
        int databaseSizeBeforeUpdate = bauteilGruppeRepository.findAll().size();
        bauteilGruppe.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBauteilGruppeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bauteilGruppe))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BauteilGruppe in the database
        List<BauteilGruppe> bauteilGruppeList = bauteilGruppeRepository.findAll();
        assertThat(bauteilGruppeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBauteilGruppeWithPatch() throws Exception {
        // Initialize the database
        bauteilGruppeRepository.saveAndFlush(bauteilGruppe);

        int databaseSizeBeforeUpdate = bauteilGruppeRepository.findAll().size();

        // Update the bauteilGruppe using partial update
        BauteilGruppe partialUpdatedBauteilGruppe = new BauteilGruppe();
        partialUpdatedBauteilGruppe.setId(bauteilGruppe.getId());

        restBauteilGruppeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBauteilGruppe.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBauteilGruppe))
            )
            .andExpect(status().isOk());

        // Validate the BauteilGruppe in the database
        List<BauteilGruppe> bauteilGruppeList = bauteilGruppeRepository.findAll();
        assertThat(bauteilGruppeList).hasSize(databaseSizeBeforeUpdate);
        BauteilGruppe testBauteilGruppe = bauteilGruppeList.get(bauteilGruppeList.size() - 1);
        assertThat(testBauteilGruppe.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateBauteilGruppeWithPatch() throws Exception {
        // Initialize the database
        bauteilGruppeRepository.saveAndFlush(bauteilGruppe);

        int databaseSizeBeforeUpdate = bauteilGruppeRepository.findAll().size();

        // Update the bauteilGruppe using partial update
        BauteilGruppe partialUpdatedBauteilGruppe = new BauteilGruppe();
        partialUpdatedBauteilGruppe.setId(bauteilGruppe.getId());

        partialUpdatedBauteilGruppe.name(UPDATED_NAME);

        restBauteilGruppeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBauteilGruppe.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBauteilGruppe))
            )
            .andExpect(status().isOk());

        // Validate the BauteilGruppe in the database
        List<BauteilGruppe> bauteilGruppeList = bauteilGruppeRepository.findAll();
        assertThat(bauteilGruppeList).hasSize(databaseSizeBeforeUpdate);
        BauteilGruppe testBauteilGruppe = bauteilGruppeList.get(bauteilGruppeList.size() - 1);
        assertThat(testBauteilGruppe.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingBauteilGruppe() throws Exception {
        int databaseSizeBeforeUpdate = bauteilGruppeRepository.findAll().size();
        bauteilGruppe.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBauteilGruppeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bauteilGruppe.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bauteilGruppe))
            )
            .andExpect(status().isBadRequest());

        // Validate the BauteilGruppe in the database
        List<BauteilGruppe> bauteilGruppeList = bauteilGruppeRepository.findAll();
        assertThat(bauteilGruppeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBauteilGruppe() throws Exception {
        int databaseSizeBeforeUpdate = bauteilGruppeRepository.findAll().size();
        bauteilGruppe.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBauteilGruppeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bauteilGruppe))
            )
            .andExpect(status().isBadRequest());

        // Validate the BauteilGruppe in the database
        List<BauteilGruppe> bauteilGruppeList = bauteilGruppeRepository.findAll();
        assertThat(bauteilGruppeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBauteilGruppe() throws Exception {
        int databaseSizeBeforeUpdate = bauteilGruppeRepository.findAll().size();
        bauteilGruppe.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBauteilGruppeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bauteilGruppe))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BauteilGruppe in the database
        List<BauteilGruppe> bauteilGruppeList = bauteilGruppeRepository.findAll();
        assertThat(bauteilGruppeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBauteilGruppe() throws Exception {
        // Initialize the database
        bauteilGruppeRepository.saveAndFlush(bauteilGruppe);

        int databaseSizeBeforeDelete = bauteilGruppeRepository.findAll().size();

        // Delete the bauteilGruppe
        restBauteilGruppeMockMvc
            .perform(delete(ENTITY_API_URL_ID, bauteilGruppe.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BauteilGruppe> bauteilGruppeList = bauteilGruppeRepository.findAll();
        assertThat(bauteilGruppeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
