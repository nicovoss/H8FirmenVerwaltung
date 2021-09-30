package xyz.dulli.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import xyz.dulli.web.rest.TestUtil;

class AuftragPositionenTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AuftragPositionen.class);
        AuftragPositionen auftragPositionen1 = new AuftragPositionen();
        auftragPositionen1.setId(1L);
        AuftragPositionen auftragPositionen2 = new AuftragPositionen();
        auftragPositionen2.setId(auftragPositionen1.getId());
        assertThat(auftragPositionen1).isEqualTo(auftragPositionen2);
        auftragPositionen2.setId(2L);
        assertThat(auftragPositionen1).isNotEqualTo(auftragPositionen2);
        auftragPositionen1.setId(null);
        assertThat(auftragPositionen1).isNotEqualTo(auftragPositionen2);
    }
}
