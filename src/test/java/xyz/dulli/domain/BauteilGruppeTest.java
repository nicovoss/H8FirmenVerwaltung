package xyz.dulli.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import xyz.dulli.web.rest.TestUtil;

class BauteilGruppeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BauteilGruppe.class);
        BauteilGruppe bauteilGruppe1 = new BauteilGruppe();
        bauteilGruppe1.setId(1L);
        BauteilGruppe bauteilGruppe2 = new BauteilGruppe();
        bauteilGruppe2.setId(bauteilGruppe1.getId());
        assertThat(bauteilGruppe1).isEqualTo(bauteilGruppe2);
        bauteilGruppe2.setId(2L);
        assertThat(bauteilGruppe1).isNotEqualTo(bauteilGruppe2);
        bauteilGruppe1.setId(null);
        assertThat(bauteilGruppe1).isNotEqualTo(bauteilGruppe2);
    }
}
