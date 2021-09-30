package xyz.dulli.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import xyz.dulli.web.rest.TestUtil;

class BauteilTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bauteil.class);
        Bauteil bauteil1 = new Bauteil();
        bauteil1.setId(1L);
        Bauteil bauteil2 = new Bauteil();
        bauteil2.setId(bauteil1.getId());
        assertThat(bauteil1).isEqualTo(bauteil2);
        bauteil2.setId(2L);
        assertThat(bauteil1).isNotEqualTo(bauteil2);
        bauteil1.setId(null);
        assertThat(bauteil1).isNotEqualTo(bauteil2);
    }
}
