package xyz.dulli.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ArtikelZuBauteilmenge.
 */
@Entity
@Table(name = "artikel_zu_bauteilmenge")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ArtikelZuBauteilmenge implements Serializable {

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
    @JsonIgnoreProperties(
        value = { "auftragPositionens", "rechnungPositionens", "artikelZuBauteilmenges", "artikelTyp" },
        allowSetters = true
    )
    private Artikel artikel;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ArtikelZuBauteilmenge id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMenge() {
        return this.menge;
    }

    public ArtikelZuBauteilmenge menge(Integer menge) {
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

    public ArtikelZuBauteilmenge bauteil(Bauteil bauteil) {
        this.setBauteil(bauteil);
        return this;
    }

    public Artikel getArtikel() {
        return this.artikel;
    }

    public void setArtikel(Artikel artikel) {
        this.artikel = artikel;
    }

    public ArtikelZuBauteilmenge artikel(Artikel artikel) {
        this.setArtikel(artikel);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ArtikelZuBauteilmenge)) {
            return false;
        }
        return id != null && id.equals(((ArtikelZuBauteilmenge) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ArtikelZuBauteilmenge{" +
            "id=" + getId() +
            ", menge=" + getMenge() +
            "}";
    }
}
