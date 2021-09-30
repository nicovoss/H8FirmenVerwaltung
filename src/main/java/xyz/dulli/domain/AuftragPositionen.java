package xyz.dulli.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AuftragPositionen.
 */
@Entity
@Table(name = "auftrag_positionen")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AuftragPositionen implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "menge")
    private Integer menge;

    @ManyToOne
    @JsonIgnoreProperties(value = { "rechnungKopfs", "auftragPositionens", "status", "kunde", "bediener" }, allowSetters = true)
    private Auftrag auftrag;

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

    public AuftragPositionen id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMenge() {
        return this.menge;
    }

    public AuftragPositionen menge(Integer menge) {
        this.setMenge(menge);
        return this;
    }

    public void setMenge(Integer menge) {
        this.menge = menge;
    }

    public Auftrag getAuftrag() {
        return this.auftrag;
    }

    public void setAuftrag(Auftrag auftrag) {
        this.auftrag = auftrag;
    }

    public AuftragPositionen auftrag(Auftrag auftrag) {
        this.setAuftrag(auftrag);
        return this;
    }

    public Artikel getArtikel() {
        return this.artikel;
    }

    public void setArtikel(Artikel artikel) {
        this.artikel = artikel;
    }

    public AuftragPositionen artikel(Artikel artikel) {
        this.setArtikel(artikel);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AuftragPositionen)) {
            return false;
        }
        return id != null && id.equals(((AuftragPositionen) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AuftragPositionen{" +
            "id=" + getId() +
            ", menge=" + getMenge() +
            "}";
    }
}
