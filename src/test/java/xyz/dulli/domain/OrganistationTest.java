package xyz.dulli.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import xyz.dulli.web.rest.TestUtil;

class OrganistationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Organistation.class);
        Organistation organistation1 = new Organistation();
        organistation1.setId(1L);
        Organistation organistation2 = new Organistation();
        organistation2.setId(organistation1.getId());
        assertThat(organistation1).isEqualTo(organistation2);
        organistation2.setId(2L);
        assertThat(organistation1).isNotEqualTo(organistation2);
        organistation1.setId(null);
        assertThat(organistation1).isNotEqualTo(organistation2);
    }
}
