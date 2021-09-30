package xyz.dulli.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import xyz.dulli.web.rest.TestUtil;

class ArtikelZuBauteilmengeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ArtikelZuBauteilmenge.class);
        ArtikelZuBauteilmenge artikelZuBauteilmenge1 = new ArtikelZuBauteilmenge();
        artikelZuBauteilmenge1.setId(1L);
        ArtikelZuBauteilmenge artikelZuBauteilmenge2 = new ArtikelZuBauteilmenge();
        artikelZuBauteilmenge2.setId(artikelZuBauteilmenge1.getId());
        assertThat(artikelZuBauteilmenge1).isEqualTo(artikelZuBauteilmenge2);
        artikelZuBauteilmenge2.setId(2L);
        assertThat(artikelZuBauteilmenge1).isNotEqualTo(artikelZuBauteilmenge2);
        artikelZuBauteilmenge1.setId(null);
        assertThat(artikelZuBauteilmenge1).isNotEqualTo(artikelZuBauteilmenge2);
    }
}
