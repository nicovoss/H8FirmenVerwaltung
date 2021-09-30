package xyz.dulli.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BauteileZuRohstoffe.
 */
@Entity
@Table(name = "bauteile_zu_rohstoffe")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class BauteileZuRohstoffe implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "menge")
    private Integer menge;

    @ManyToOne
    @JsonIgnoreProperties(value = { "bauteileZuRohstoffes", "artikelZuBauteilmenges", "bauteilgruppe" }, allowSetters = true)
    private Bauteil bauteil;

    @ManyToOne
    @JsonIgnoreProperties(value = { "bauteileZuRohstoffes" }, allowSetters = true)
    private Rohstoff rohstoff;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BauteileZuRohstoffe id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMenge() {
        return this.menge;
    }

    public BauteileZuRohstoffe menge(Integer menge) {
        this.setMenge(menge);
        return this;
    }

    public void setMenge(Integer menge) {
        this.menge = menge;
    }

    public Bauteil getBauteil() {
        return this.bauteil;
    }

    public void setBauteil(Bauteil bauteil) {
        this.bauteil = bauteil;
    }

    public BauteileZuRohstoffe bauteil(Bauteil bauteil) {
        this.setBauteil(bauteil);
        return this;
    }

    public Rohstoff getRohstoff() {
        return this.rohstoff;
    }

    public void setRohstoff(Rohstoff rohstoff) {
        this.rohstoff = rohstoff;
    }

    public BauteileZuRohstoffe rohstoff(Rohstoff rohstoff) {
        this.setRohstoff(rohstoff);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BauteileZuRohstoffe)) {
            return false;
        }
        return id != null && id.equals(((BauteileZuRohstoffe) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BauteileZuRohstoffe{" +
            "id=" + getId() +
            ", menge=" + getMenge() +
            "}";
    }
}
