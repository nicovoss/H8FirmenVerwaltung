package xyz.dulli.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Artikel.
 */
@Entity
@Table(name = "artikel")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Artikel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "artikel")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "auftrag", "artikel" }, allowSetters = true)
    private Set<AuftragPositionen> auftragPositionens = new HashSet<>();

    @OneToMany(mappedBy = "artikel")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "rechnungskopf", "artikel" }, allowSetters = true)
    private Set<RechnungPositionen> rechnungPositionens = new HashSet<>();

    @OneToMany(mappedBy = "artikel")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "bauteil", "artikel" }, allowSetters = true)
    private Set<ArtikelZuBauteilmenge> artikelZuBauteilmenges = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "artikels", "bauteilGruppes" }, allowSetters = true)
    private ArtikelTyp artikelTyp;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Artikel id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Artikel name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<AuftragPositionen> getAuftragPositionens() {
        return this.auftragPositionens;
    }

    public void setAuftragPositionens(Set<AuftragPositionen> auftragPositionens) {
        if (this.auftragPositionens != null) {
            this.auftragPositionens.forEach(i -> i.setArtikel(null));
        }
        if (auftragPositionens != null) {
            auftragPositionens.forEach(i -> i.setArtikel(this));
        }
        this.auftragPositionens = auftragPositionens;
    }

    public Artikel auftragPositionens(Set<AuftragPositionen> auftragPositionens) {
        this.setAuftragPositionens(auftragPositionens);
        return this;
    }

    public Artikel addAuftragPositionen(AuftragPositionen auftragPositionen) {
        this.auftragPositionens.add(auftragPositionen);
        auftragPositionen.setArtikel(this);
        return this;
    }

    public Artikel removeAuftragPositionen(AuftragPositionen auftragPositionen) {
        this.auftragPositionens.remove(auftragPositionen);
        auftragPositionen.setArtikel(null);
        return this;
    }

    public Set<RechnungPositionen> getRechnungPositionens() {
        return this.rechnungPositionens;
    }

    public void setRechnungPositionens(Set<RechnungPositionen> rechnungPositionens) {
        if (this.rechnungPositionens != null) {
            this.rechnungPositionens.forEach(i -> i.setArtikel(null));
        }
        if (rechnungPositionens != null) {
            rechnungPositionens.forEach(i -> i.setArtikel(this));
        }
        this.rechnungPositionens = rechnungPositionens;
    }

    public Artikel rechnungPositionens(Set<RechnungPositionen> rechnungPositionens) {
        this.setRechnungPositionens(rechnungPositionens);
        return this;
    }

    public Artikel addRechnungPositionen(RechnungPositionen rechnungPositionen) {
        this.rechnungPositionens.add(rechnungPositionen);
        rechnungPositionen.setArtikel(this);
        return this;
    }

    public Artikel removeRechnungPositionen(RechnungPositionen rechnungPositionen) {
        this.rechnungPositionens.remove(rechnungPositionen);
        rechnungPositionen.setArtikel(null);
        return this;
    }

    public Set<ArtikelZuBauteilmenge> getArtikelZuBauteilmenges() {
        return this.artikelZuBauteilmenges;
    }

    public void setArtikelZuBauteilmenges(Set<ArtikelZuBauteilmenge> artikelZuBauteilmenges) {
        if (this.artikelZuBauteilmenges != null) {
            this.artikelZuBauteilmenges.forEach(i -> i.setArtikel(null));
        }
        if (artikelZuBauteilmenges != null) {
            artikelZuBauteilmenges.forEach(i -> i.setArtikel(this));
        }
        this.artikelZuBauteilmenges = artikelZuBauteilmenges;
    }

    public Artikel artikelZuBauteilmenges(Set<ArtikelZuBauteilmenge> artikelZuBauteilmenges) {
        this.setArtikelZuBauteilmenges(artikelZuBauteilmenges);
        return this;
    }

    public Artikel addArtikelZuBauteilmenge(ArtikelZuBauteilmenge artikelZuBauteilmenge) {
        this.artikelZuBauteilmenges.add(artikelZuBauteilmenge);
        artikelZuBauteilmenge.setArtikel(this);
        return this;
    }

    public Artikel removeArtikelZuBauteilmenge(ArtikelZuBauteilmenge artikelZuBauteilmenge) {
        this.artikelZuBauteilmenges.remove(artikelZuBauteilmenge);
        artikelZuBauteilmenge.setArtikel(null);
        return this;
    }

    public ArtikelTyp getArtikelTyp() {
        return this.artikelTyp;
    }

    public void setArtikelTyp(ArtikelTyp artikelTyp) {
        this.artikelTyp = artikelTyp;
    }

    public Artikel artikelTyp(ArtikelTyp artikelTyp) {
        this.setArtikelTyp(artikelTyp);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Artikel)) {
            return false;
        }
        return id != null && id.equals(((Artikel) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Artikel{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
