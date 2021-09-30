package xyz.dulli.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import xyz.dulli.web.rest.TestUtil;

class ArtikelTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Artikel.class);
        Artikel artikel1 = new Artikel();
        artikel1.setId(1L);
        Artikel artikel2 = new Artikel();
        artikel2.setId(artikel1.getId());
        assertThat(artikel1).isEqualTo(artikel2);
        artikel2.setId(2L);
        assertThat(artikel1).isNotEqualTo(artikel2);
        artikel1.setId(null);
        assertThat(artikel1).isNotEqualTo(artikel2);
    }
}
