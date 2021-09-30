package xyz.dulli.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ArtikelTyp.
 */
@Entity
@Table(name = "artikel_typ")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ArtikelTyp implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "artikelTyp")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "auftragPositionens", "rechnungPositionens", "artikelZuBauteilmenges", "artikelTyp" },
        allowSetters = true
    )
    private Set<Artikel> artikels = new HashSet<>();

    @OneToMany(mappedBy = "artikelTyp")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "bauteils", "artikelTyp" }, allowSetters = true)
    private Set<BauteilGruppe> bauteilGruppes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ArtikelTyp id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ArtikelTyp name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Artikel> getArtikels() {
        return this.artikels;
    }

    public void setArtikels(Set<Artikel> artikels) {
        if (this.artikels != null) {
            this.artikels.forEach(i -> i.setArtikelTyp(null));
        }
        if (artikels != null) {
            artikels.forEach(i -> i.setArtikelTyp(this));
        }
        this.artikels = artikels;
    }

    public ArtikelTyp artikels(Set<Artikel> artikels) {
        this.setArtikels(artikels);
        return this;
    }

    public ArtikelTyp addArtikel(Artikel artikel) {
        this.artikels.add(artikel);
        artikel.setArtikelTyp(this);
        return this;
    }

    public ArtikelTyp removeArtikel(Artikel artikel) {
        this.artikels.remove(artikel);
        artikel.setArtikelTyp(null);
        return this;
    }

    public Set<BauteilGruppe> getBauteilGruppes() {
        return this.bauteilGruppes;
    }

    public void setBauteilGruppes(Set<BauteilGruppe> bauteilGruppes) {
        if (this.bauteilGruppes != null) {
            this.bauteilGruppes.forEach(i -> i.setArtikelTyp(null));
        }
        if (bauteilGruppes != null) {
            bauteilGruppes.forEach(i -> i.setArtikelTyp(this));
        }
        this.bauteilGruppes = bauteilGruppes;
    }

    public ArtikelTyp bauteilGruppes(Set<BauteilGruppe> bauteilGruppes) {
        this.setBauteilGruppes(bauteilGruppes);
        return this;
    }

    public ArtikelTyp addBauteilGruppe(BauteilGruppe bauteilGruppe) {
        this.bauteilGruppes.add(bauteilGruppe);
        bauteilGruppe.setArtikelTyp(this);
        return this;
    }

    public ArtikelTyp removeBauteilGruppe(BauteilGruppe bauteilGruppe) {
        this.bauteilGruppes.remove(bauteilGruppe);
        bauteilGruppe.setArtikelTyp(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ArtikelTyp)) {
            return false;
        }
        return id != null && id.equals(((ArtikelTyp) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ArtikelTyp{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
