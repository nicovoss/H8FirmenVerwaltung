package xyz.dulli.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import xyz.dulli.web.rest.TestUtil;

class RechnungKopfTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RechnungKopf.class);
        RechnungKopf rechnungKopf1 = new RechnungKopf();
        rechnungKopf1.setId(1L);
        RechnungKopf rechnungKopf2 = new RechnungKopf();
        rechnungKopf2.setId(rechnungKopf1.getId());
        assertThat(rechnungKopf1).isEqualTo(rechnungKopf2);
        rechnungKopf2.setId(2L);
        assertThat(rechnungKopf1).isNotEqualTo(rechnungKopf2);
        rechnungKopf1.setId(null);
        assertThat(rechnungKopf1).isNotEqualTo(rechnungKopf2);
    }
}
