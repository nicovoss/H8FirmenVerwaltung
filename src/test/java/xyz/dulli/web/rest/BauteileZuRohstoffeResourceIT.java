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
import xyz.dulli.domain.BauteileZuRohstoffe;
import xyz.dulli.repository.BauteileZuRohstoffeRepository;

/**
 * Integration tests for the {@link BauteileZuRohstoffeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BauteileZuRohstoffeResourceIT {

    private static final Integer DEFAULT_MENGE = 1;
    private static final Integer UPDATED_MENGE = 2;

    private static final String ENTITY_API_URL = "/api/bauteile-zu-rohstoffes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BauteileZuRohstoffeRepository bauteileZuRohstoffeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBauteileZuRohstoffeMockMvc;

    private BauteileZuRohstoffe bauteileZuRohstoffe;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BauteileZuRohstoffe createEntity(EntityManager em) {
        BauteileZuRohstoffe bauteileZuRohstoffe = new BauteileZuRohstoffe().menge(DEFAULT_MENGE);
        return bauteileZuRohstoffe;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BauteileZuRohstoffe createUpdatedEntity(EntityManager em) {
        BauteileZuRohstoffe bauteileZuRohstoffe = new BauteileZuRohstoffe().menge(UPDATED_MENGE);
        return bauteileZuRohstoffe;
    }

    @BeforeEach
    public void initTest() {
        bauteileZuRohstoffe = createEntity(em);
    }

    @Test
    @Transactional
    void createBauteileZuRohstoffe() throws Exception {
        int databaseSizeBeforeCreate = bauteileZuRohstoffeRepository.findAll().size();
        // Create the BauteileZuRohstoffe
        restBauteileZuRohstoffeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bauteileZuRohstoffe))
            )
            .andExpect(status().isCreated());

        // Validate the BauteileZuRohstoffe in the database
        List<BauteileZuRohstoffe> bauteileZuRohstoffeList = bauteileZuRohstoffeRepository.findAll();
        assertThat(bauteileZuRohstoffeList).hasSize(databaseSizeBeforeCreate + 1);
        BauteileZuRohstoffe testBauteileZuRohstoffe = bauteileZuRohstoffeList.get(bauteileZuRohstoffeList.size() - 1);
        assertThat(testBauteileZuRohstoffe.getMenge()).isEqualTo(DEFAULT_MENGE);
    }

    @Test
    @Transactional
    void createBauteileZuRohstoffeWithExistingId() throws Exception {
        // Create the BauteileZuRohstoffe with an existing ID
        bauteileZuRohstoffe.setId(1L);

        int databaseSizeBeforeCreate = bauteileZuRohstoffeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBauteileZuRohstoffeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bauteileZuRohstoffe))
            )
            .andExpect(status().isBadRequest());

        // Validate the BauteileZuRohstoffe in the database
        List<BauteileZuRohstoffe> bauteileZuRohstoffeList = bauteileZuRohstoffeRepository.findAll();
        assertThat(bauteileZuRohstoffeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBauteileZuRohstoffes() throws Exception {
        // Initialize the database
        bauteileZuRohstoffeRepository.saveAndFlush(bauteileZuRohstoffe);

        // Get all the bauteileZuRohstoffeList
        restBauteileZuRohstoffeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bauteileZuRohstoffe.getId().intValue())))
            .andExpect(jsonPath("$.[*].menge").value(hasItem(DEFAULT_MENGE)));
    }

    @Test
    @Transactional
    void getBauteileZuRohstoffe() throws Exception {
        // Initialize the database
        bauteileZuRohstoffeRepository.saveAndFlush(bauteileZuRohstoffe);

        // Get the bauteileZuRohstoffe
        restBauteileZuRohstoffeMockMvc
            .perform(get(ENTITY_API_URL_ID, bauteileZuRohstoffe.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bauteileZuRohstoffe.getId().intValue()))
            .andExpect(jsonPath("$.menge").value(DEFAULT_MENGE));
    }

    @Test
    @Transactional
    void getNonExistingBauteileZuRohstoffe() throws Exception {
        // Get the bauteileZuRohstoffe
        restBauteileZuRohstoffeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBauteileZuRohstoffe() throws Exception {
        // Initialize the database
        bauteileZuRohstoffeRepository.saveAndFlush(bauteileZuRohstoffe);

        int databaseSizeBeforeUpdate = bauteileZuRohstoffeRepository.findAll().size();

        // Update the bauteileZuRohstoffe
        BauteileZuRohstoffe updatedBauteileZuRohstoffe = bauteileZuRohstoffeRepository.findById(bauteileZuRohstoffe.getId()).get();
        // Disconnect from session so that the updates on updatedBauteileZuRohstoffe are not directly saved in db
        em.detach(updatedBauteileZuRohstoffe);
        updatedBauteileZuRohstoffe.menge(UPDATED_MENGE);

        restBauteileZuRohstoffeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBauteileZuRohstoffe.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBauteileZuRohstoffe))
            )
            .andExpect(status().isOk());

        // Validate the BauteileZuRohstoffe in the database
        List<BauteileZuRohstoffe> bauteileZuRohstoffeList = bauteileZuRohstoffeRepository.findAll();
        assertThat(bauteileZuRohstoffeList).hasSize(databaseSizeBeforeUpdate);
        BauteileZuRohstoffe testBauteileZuRohstoffe = bauteileZuRohstoffeList.get(bauteileZuRohstoffeList.size() - 1);
        assertThat(testBauteileZuRohstoffe.getMenge()).isEqualTo(UPDATED_MENGE);
    }

    @Test
    @Transactional
    void putNonExistingBauteileZuRohstoffe() throws Exception {
        int databaseSizeBeforeUpdate = bauteileZuRohstoffeRepository.findAll().size();
        bauteileZuRohstoffe.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBauteileZuRohstoffeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bauteileZuRohstoffe.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bauteileZuRohstoffe))
            )
            .andExpect(status().isBadRequest());

        // Validate the BauteileZuRohstoffe in the database
        List<BauteileZuRohstoffe> bauteileZuRohstoffeList = bauteileZuRohstoffeRepository.findAll();
        assertThat(bauteileZuRohstoffeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBauteileZuRohstoffe() throws Exception {
        int databaseSizeBeforeUpdate = bauteileZuRohstoffeRepository.findAll().size();
        bauteileZuRohstoffe.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBauteileZuRohstoffeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bauteileZuRohstoffe))
            )
            .andExpect(status().isBadRequest());

        // Validate the BauteileZuRohstoffe in the database
        List<BauteileZuRohstoffe> bauteileZuRohstoffeList = bauteileZuRohstoffeRepository.findAll();
        assertThat(bauteileZuRohstoffeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBauteileZuRohstoffe() throws Exception {
        int databaseSizeBeforeUpdate = bauteileZuRohstoffeRepository.findAll().size();
        bauteileZuRohstoffe.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBauteileZuRohstoffeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bauteileZuRohstoffe))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BauteileZuRohstoffe in the database
        List<BauteileZuRohstoffe> bauteileZuRohstoffeList = bauteileZuRohstoffeRepository.findAll();
        assertThat(bauteileZuRohstoffeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBauteileZuRohstoffeWithPatch() throws Exception {
        // Initialize the database
        bauteileZuRohstoffeRepository.saveAndFlush(bauteileZuRohstoffe);

        int databaseSizeBeforeUpdate = bauteileZuRohstoffeRepository.findAll().size();

        // Update the bauteileZuRohstoffe using partial update
        BauteileZuRohstoffe partialUpdatedBauteileZuRohstoffe = new BauteileZuRohstoffe();
        partialUpdatedBauteileZuRohstoffe.setId(bauteileZuRohstoffe.getId());

        partialUpdatedBauteileZuRohstoffe.menge(UPDATED_MENGE);

        restBauteileZuRohstoffeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBauteileZuRohstoffe.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBauteileZuRohstoffe))
            )
            .andExpect(status().isOk());

        // Validate the BauteileZuRohstoffe in the database
        List<BauteileZuRohstoffe> bauteileZuRohstoffeList = bauteileZuRohstoffeRepository.findAll();
        assertThat(bauteileZuRohstoffeList).hasSize(databaseSizeBeforeUpdate);
        BauteileZuRohstoffe testBauteileZuRohstoffe = bauteileZuRohstoffeList.get(bauteileZuRohstoffeList.size() - 1);
        assertThat(testBauteileZuRohstoffe.getMenge()).isEqualTo(UPDATED_MENGE);
    }

    @Test
    @Transactional
    void fullUpdateBauteileZuRohstoffeWithPatch() throws Exception {
        // Initialize the database
        bauteileZuRohstoffeRepository.saveAndFlush(bauteileZuRohstoffe);

        int databaseSizeBeforeUpdate = bauteileZuRohstoffeRepository.findAll().size();

        // Update the bauteileZuRohstoffe using partial update
        BauteileZuRohstoffe partialUpdatedBauteileZuRohstoffe = new BauteileZuRohstoffe();
        partialUpdatedBauteileZuRohstoffe.setId(bauteileZuRohstoffe.getId());

        partialUpdatedBauteileZuRohstoffe.menge(UPDATED_MENGE);

        restBauteileZuRohstoffeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBauteileZuRohstoffe.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBauteileZuRohstoffe))
            )
            .andExpect(status().isOk());

        // Validate the BauteileZuRohstoffe in the database
        List<BauteileZuRohstoffe> bauteileZuRohstoffeList = bauteileZuRohstoffeRepository.findAll();
        assertThat(bauteileZuRohstoffeList).hasSize(databaseSizeBeforeUpdate);
        BauteileZuRohstoffe testBauteileZuRohstoffe = bauteileZuRohstoffeList.get(bauteileZuRohstoffeList.size() - 1);
        assertThat(testBauteileZuRohstoffe.getMenge()).isEqualTo(UPDATED_MENGE);
    }

    @Test
    @Transactional
    void patchNonExistingBauteileZuRohstoffe() throws Exception {
        int databaseSizeBeforeUpdate = bauteileZuRohstoffeRepository.findAll().size();
        bauteileZuRohstoffe.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBauteileZuRohstoffeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bauteileZuRohstoffe.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bauteileZuRohstoffe))
            )
            .andExpect(status().isBadRequest());

        // Validate the BauteileZuRohstoffe in the database
        List<BauteileZuRohstoffe> bauteileZuRohstoffeList = bauteileZuRohstoffeRepository.findAll();
        assertThat(bauteileZuRohstoffeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBauteileZuRohstoffe() throws Exception {
        int databaseSizeBeforeUpdate = bauteileZuRohstoffeRepository.findAll().size();
        bauteileZuRohstoffe.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBauteileZuRohstoffeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bauteileZuRohstoffe))
            )
            .andExpect(status().isBadRequest());

        // Validate the BauteileZuRohstoffe in the database
        List<BauteileZuRohstoffe> bauteileZuRohstoffeList = bauteileZuRohstoffeRepository.findAll();
        assertThat(bauteileZuRohstoffeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBauteileZuRohstoffe() throws Exception {
        int databaseSizeBeforeUpdate = bauteileZuRohstoffeRepository.findAll().size();
        bauteileZuRohstoffe.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBauteileZuRohstoffeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bauteileZuRohstoffe))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BauteileZuRohstoffe in the database
        List<BauteileZuRohstoffe> bauteileZuRohstoffeList = bauteileZuRohstoffeRepository.findAll();
        assertThat(bauteileZuRohstoffeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBauteileZuRohstoffe() throws Exception {
        // Initialize the database
        bauteileZuRohstoffeRepository.saveAndFlush(bauteileZuRohstoffe);

        int databaseSizeBeforeDelete = bauteileZuRohstoffeRepository.findAll().size();

        // Delete the bauteileZuRohstoffe
        restBauteileZuRohstoffeMockMvc
            .perform(delete(ENTITY_API_URL_ID, bauteileZuRohstoffe.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BauteileZuRohstoffe> bauteileZuRohstoffeList = bauteileZuRohstoffeRepository.findAll();
        assertThat(bauteileZuRohstoffeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
