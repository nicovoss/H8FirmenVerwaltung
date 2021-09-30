package xyz.dulli.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import xyz.dulli.web.rest.TestUtil;

class PatnerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Patner.class);
        Patner patner1 = new Patner();
        patner1.setId(1L);
        Patner patner2 = new Patner();
        patner2.setId(patner1.getId());
        assertThat(patner1).isEqualTo(patner2);
        patner2.setId(2L);
        assertThat(patner1).isNotEqualTo(patner2);
        patner1.setId(null);
        assertThat(patner1).isNotEqualTo(patner2);
    }
}
