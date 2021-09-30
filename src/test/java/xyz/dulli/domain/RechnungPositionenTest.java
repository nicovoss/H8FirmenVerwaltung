package xyz.dulli.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import xyz.dulli.web.rest.TestUtil;

class RechnungPositionenTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RechnungPositionen.class);
        RechnungPositionen rechnungPositionen1 = new RechnungPositionen();
        rechnungPositionen1.setId(1L);
        RechnungPositionen rechnungPositionen2 = new RechnungPositionen();
        rechnungPositionen2.setId(rechnungPositionen1.getId());
        assertThat(rechnungPositionen1).isEqualTo(rechnungPositionen2);
        rechnungPositionen2.setId(2L);
        assertThat(rechnungPositionen1).isNotEqualTo(rechnungPositionen2);
        rechnungPositionen1.setId(null);
        assertThat(rechnungPositionen1).isNotEqualTo(rechnungPositionen2);
    }
}
