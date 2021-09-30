package xyz.dulli.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import xyz.dulli.web.rest.TestUtil;

class RohstoffTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Rohstoff.class);
        Rohstoff rohstoff1 = new Rohstoff();
        rohstoff1.setId(1L);
        Rohstoff rohstoff2 = new Rohstoff();
        rohstoff2.setId(rohstoff1.getId());
        assertThat(rohstoff1).isEqualTo(rohstoff2);
        rohstoff2.setId(2L);
        assertThat(rohstoff1).isNotEqualTo(rohstoff2);
        rohstoff1.setId(null);
        assertThat(rohstoff1).isNotEqualTo(rohstoff2);
    }
}
