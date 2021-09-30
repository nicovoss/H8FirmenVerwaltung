package xyz.dulli.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import xyz.dulli.web.rest.TestUtil;

class BedienerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bediener.class);
        Bediener bediener1 = new Bediener();
        bediener1.setId(1L);
        Bediener bediener2 = new Bediener();
        bediener2.setId(bediener1.getId());
        assertThat(bediener1).isEqualTo(bediener2);
        bediener2.setId(2L);
        assertThat(bediener1).isNotEqualTo(bediener2);
        bediener1.setId(null);
        assertThat(bediener1).isNotEqualTo(bediener2);
    }
}
