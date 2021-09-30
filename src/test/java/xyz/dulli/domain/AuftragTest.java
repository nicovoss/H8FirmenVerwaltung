package xyz.dulli.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import xyz.dulli.web.rest.TestUtil;

class AuftragTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Auftrag.class);
        Auftrag auftrag1 = new Auftrag();
        auftrag1.setId(1L);
        Auftrag auftrag2 = new Auftrag();
        auftrag2.setId(auftrag1.getId());
        assertThat(auftrag1).isEqualTo(auftrag2);
        auftrag2.setId(2L);
        assertThat(auftrag1).isNotEqualTo(auftrag2);
        auftrag1.setId(null);
        assertThat(auftrag1).isNotEqualTo(auftrag2);
    }
}
