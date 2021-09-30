package xyz.dulli.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import xyz.dulli.web.rest.TestUtil;

class BauteileZuRohstoffeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BauteileZuRohstoffe.class);
        BauteileZuRohstoffe bauteileZuRohstoffe1 = new BauteileZuRohstoffe();
        bauteileZuRohstoffe1.setId(1L);
        BauteileZuRohstoffe bauteileZuRohstoffe2 = new BauteileZuRohstoffe();
        bauteileZuRohstoffe2.setId(bauteileZuRohstoffe1.getId());
        assertThat(bauteileZuRohstoffe1).isEqualTo(bauteileZuRohstoffe2);
        bauteileZuRohstoffe2.setId(2L);
        assertThat(bauteileZuRohstoffe1).isNotEqualTo(bauteileZuRohstoffe2);
        bauteileZuRohstoffe1.setId(null);
        assertThat(bauteileZuRohstoffe1).isNotEqualTo(bauteileZuRohstoffe2);
    }
}
