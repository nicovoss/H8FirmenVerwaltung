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
import xyz.dulli.domain.Organistation;
import xyz.dulli.repository.OrganistationRepository;

/**
 * Integration tests for the {@link OrganistationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrganistationResourceIT {

    private static final Integer DEFAULT_ORGA_ID = 1;
    private static final Integer UPDATED_ORGA_ID = 2;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/organistations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OrganistationRepository organistationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrganistationMockMvc;

    private Organistation organistation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Organistation createEntity(EntityManager em) {
        Organistation organistation = new Organistation().orgaId(DEFAULT_ORGA_ID).name(DEFAULT_NAME);
        return organistation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Organistation createUpdatedEntity(EntityManager em) {
        Organistation organistation = new Organistation().orgaId(UPDATED_ORGA_ID).name(UPDATED_NAME);
        return organistation;
    }

    @BeforeEach
    public void initTest() {
        organistation = createEntity(em);
    }

    @Test
    @Transactional
    void createOrganistation() throws Exception {
        int databaseSizeBeforeCreate = organistationRepository.findAll().size();
        // Create the Organistation
        restOrganistationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organistation))
            )
            .andExpect(status().isCreated());

        // Validate the Organistation in the database
        List<Organistation> organistationList = organistationRepository.findAll();
        assertThat(organistationList).hasSize(databaseSizeBeforeCreate + 1);
        Organistation testOrganistation = organistationList.get(organistationList.size() - 1);
        assertThat(testOrganistation.getOrgaId()).isEqualTo(DEFAULT_ORGA_ID);
        assertThat(testOrganistation.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createOrganistationWithExistingId() throws Exception {
        // Create the Organistation with an existing ID
        organistation.setId(1L);

        int databaseSizeBeforeCreate = organistationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrganistationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organistation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Organistation in the database
        List<Organistation> organistationList = organistationRepository.findAll();
        assertThat(organistationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkOrgaIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = organistationRepository.findAll().size();
        // set the field null
        organistation.setOrgaId(null);

        // Create the Organistation, which fails.

        restOrganistationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organistation))
            )
            .andExpect(status().isBadRequest());

        List<Organistation> organistationList = organistationRepository.findAll();
        assertThat(organistationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOrganistations() throws Exception {
        // Initialize the database
        organistationRepository.saveAndFlush(organistation);

        // Get all the organistationList
        restOrganistationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(organistation.getId().intValue())))
            .andExpect(jsonPath("$.[*].orgaId").value(hasItem(DEFAULT_ORGA_ID)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getOrganistation() throws Exception {
        // Initialize the database
        organistationRepository.saveAndFlush(organistation);

        // Get the organistation
        restOrganistationMockMvc
            .perform(get(ENTITY_API_URL_ID, organistation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(organistation.getId().intValue()))
            .andExpect(jsonPath("$.orgaId").value(DEFAULT_ORGA_ID))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingOrganistation() throws Exception {
        // Get the organistation
        restOrganistationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOrganistation() throws Exception {
        // Initialize the database
        organistationRepository.saveAndFlush(organistation);

        int databaseSizeBeforeUpdate = organistationRepository.findAll().size();

        // Update the organistation
        Organistation updatedOrganistation = organistationRepository.findById(organistation.getId()).get();
        // Disconnect from session so that the updates on updatedOrganistation are not directly saved in db
        em.detach(updatedOrganistation);
        updatedOrganistation.orgaId(UPDATED_ORGA_ID).name(UPDATED_NAME);

        restOrganistationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrganistation.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrganistation))
            )
            .andExpect(status().isOk());

        // Validate the Organistation in the database
        List<Organistation> organistationList = organistationRepository.findAll();
        assertThat(organistationList).hasSize(databaseSizeBeforeUpdate);
        Organistation testOrganistation = organistationList.get(organistationList.size() - 1);
        assertThat(testOrganistation.getOrgaId()).isEqualTo(UPDATED_ORGA_ID);
        assertThat(testOrganistation.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingOrganistation() throws Exception {
        int databaseSizeBeforeUpdate = organistationRepository.findAll().size();
        organistation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrganistationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, organistation.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organistation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Organistation in the database
        List<Organistation> organistationList = organistationRepository.findAll();
        assertThat(organistationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrganistation() throws Exception {
        int databaseSizeBeforeUpdate = organistationRepository.findAll().size();
        organistation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganistationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organistation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Organistation in the database
        List<Organistation> organistationList = organistationRepository.findAll();
        assertThat(organistationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrganistation() throws Exception {
        int databaseSizeBeforeUpdate = organistationRepository.findAll().size();
        organistation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganistationMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organistation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Organistation in the database
        List<Organistation> organistationList = organistationRepository.findAll();
        assertThat(organistationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrganistationWithPatch() throws Exception {
        // Initialize the database
        organistationRepository.saveAndFlush(organistation);

        int databaseSizeBeforeUpdate = organistationRepository.findAll().size();

        // Update the organistation using partial update
        Organistation partialUpdatedOrganistation = new Organistation();
        partialUpdatedOrganistation.setId(organistation.getId());

        partialUpdatedOrganistation.orgaId(UPDATED_ORGA_ID);

        restOrganistationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrganistation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrganistation))
            )
            .andExpect(status().isOk());

        // Validate the Organistation in the database
        List<Organistation> organistationList = organistationRepository.findAll();
        assertThat(organistationList).hasSize(databaseSizeBeforeUpdate);
        Organistation testOrganistation = organistationList.get(organistationList.size() - 1);
        assertThat(testOrganistation.getOrgaId()).isEqualTo(UPDATED_ORGA_ID);
        assertThat(testOrganistation.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateOrganistationWithPatch() throws Exception {
        // Initialize the database
        organistationRepository.saveAndFlush(organistation);

        int databaseSizeBeforeUpdate = organistationRepository.findAll().size();

        // Update the organistation using partial update
        Organistation partialUpdatedOrganistation = new Organistation();
        partialUpdatedOrganistation.setId(organistation.getId());

        partialUpdatedOrganistation.orgaId(UPDATED_ORGA_ID).name(UPDATED_NAME);

        restOrganistationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrganistation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrganistation))
            )
            .andExpect(status().isOk());

        // Validate the Organistation in the database
        List<Organistation> organistationList = organistationRepository.findAll();
        assertThat(organistationList).hasSize(databaseSizeBeforeUpdate);
        Organistation testOrganistation = organistationList.get(organistationList.size() - 1);
        assertThat(testOrganistation.getOrgaId()).isEqualTo(UPDATED_ORGA_ID);
        assertThat(testOrganistation.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingOrganistation() throws Exception {
        int databaseSizeBeforeUpdate = organistationRepository.findAll().size();
        organistation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrganistationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, organistation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organistation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Organistation in the database
        List<Organistation> organistationList = organistationRepository.findAll();
        assertThat(organistationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrganistation() throws Exception {
        int databaseSizeBeforeUpdate = organistationRepository.findAll().size();
        organistation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganistationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organistation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Organistation in the database
        List<Organistation> organistationList = organistationRepository.findAll();
        assertThat(organistationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrganistation() throws Exception {
        int databaseSizeBeforeUpdate = organistationRepository.findAll().size();
        organistation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganistationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organistation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Organistation in the database
        List<Organistation> organistationList = organistationRepository.findAll();
        assertThat(organistationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrganistation() throws Exception {
        // Initialize the database
        organistationRepository.saveAndFlush(organistation);

        int databaseSizeBeforeDelete = organistationRepository.findAll().size();

        // Delete the organistation
        restOrganistationMockMvc
            .perform(delete(ENTITY_API_URL_ID, organistation.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Organistation> organistationList = organistationRepository.findAll();
        assertThat(organistationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
