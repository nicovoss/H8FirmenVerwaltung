package xyz.dulli.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import xyz.dulli.web.rest.TestUtil;

class ArtikelTypTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ArtikelTyp.class);
        ArtikelTyp artikelTyp1 = new ArtikelTyp();
        artikelTyp1.setId(1L);
        ArtikelTyp artikelTyp2 = new ArtikelTyp();
        artikelTyp2.setId(artikelTyp1.getId());
        assertThat(artikelTyp1).isEqualTo(artikelTyp2);
        artikelTyp2.setId(2L);
        assertThat(artikelTyp1).isNotEqualTo(artikelTyp2);
        artikelTyp1.setId(null);
        assertThat(artikelTyp1).isNotEqualTo(artikelTyp2);
    }
}
