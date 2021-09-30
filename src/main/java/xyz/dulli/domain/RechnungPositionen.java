package xyz.dulli.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RechnungPositionen.
 */
@Entity
@Table(name = "rechnung_positionen")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RechnungPositionen implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "artikel_name")
    private String artikelName;

    @Column(name = "artikel_beschreibung")
    private String artikelBeschreibung;

    @Column(name = "artikel_preis")
    private Integer artikelPreis;

    @NotNull
    @Column(name = "menge", nullable = false)
    private Integer menge;

    @ManyToOne
    @JsonIgnoreProperties(value = { "rechnungPositionens", "auftrag", "bediner", "kunde", "status" }, allowSetters = true)
    private RechnungKopf rechnungskopf;

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

    public RechnungPositionen id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getArtikelName() {
        return this.artikelName;
    }

    public RechnungPositionen artikelName(String artikelName) {
        this.setArtikelName(artikelName);
        return this;
    }

    public void setArtikelName(String artikelName) {
        this.artikelName = artikelName;
    }

    public String getArtikelBeschreibung() {
        return this.artikelBeschreibung;
    }

    public RechnungPositionen artikelBeschreibung(String artikelBeschreibung) {
        this.setArtikelBeschreibung(artikelBeschreibung);
        return this;
    }

    public void setArtikelBeschreibung(String artikelBeschreibung) {
        this.artikelBeschreibung = artikelBeschreibung;
    }

    public Integer getArtikelPreis() {
        return this.artikelPreis;
    }

    public RechnungPositionen artikelPreis(Integer artikelPreis) {
        this.setArtikelPreis(artikelPreis);
        return this;
    }

    public void setArtikelPreis(Integer artikelPreis) {
        this.artikelPreis = artikelPreis;
    }

    public Integer getMenge() {
        return this.menge;
    }

    public RechnungPositionen menge(Integer menge) {
        this.setMenge(menge);
        return this;
    }

    public void setMenge(Integer menge) {
        this.menge = menge;
    }

    public RechnungKopf getRechnungskopf() {
        return this.rechnungskopf;
    }

    public void setRechnungskopf(RechnungKopf rechnungKopf) {
        this.rechnungskopf = rechnungKopf;
    }

    public RechnungPositionen rechnungskopf(RechnungKopf rechnungKopf) {
        this.setRechnungskopf(rechnungKopf);
        return this;
    }

    public Artikel getArtikel() {
        return this.artikel;
    }

    public void setArtikel(Artikel artikel) {
        this.artikel = artikel;
    }

    public RechnungPositionen artikel(Artikel artikel) {
        this.setArtikel(artikel);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RechnungPositionen)) {
            return false;
        }
        return id != null && id.equals(((RechnungPositionen) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RechnungPositionen{" +
            "id=" + getId() +
            ", artikelName='" + getArtikelName() + "'" +
            ", artikelBeschreibung='" + getArtikelBeschreibung() + "'" +
            ", artikelPreis=" + getArtikelPreis() +
            ", menge=" + getMenge() +
            "}";
    }
}
