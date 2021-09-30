package xyz.dulli.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Bauteil.
 */
@Entity
@Table(name = "bauteil")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Bauteil implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "bauteil")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "bauteil", "rohstoff" }, allowSetters = true)
    private Set<BauteileZuRohstoffe> bauteileZuRohstoffes = new HashSet<>();

    @OneToMany(mappedBy = "bauteil")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "bauteil", "artikel" }, allowSetters = true)
    private Set<ArtikelZuBauteilmenge> artikelZuBauteilmenges = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "bauteils", "artikelTyp" }, allowSetters = true)
    private BauteilGruppe bauteilgruppe;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Bauteil id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Bauteil name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<BauteileZuRohstoffe> getBauteileZuRohstoffes() {
        return this.bauteileZuRohstoffes;
    }

    public void setBauteileZuRohstoffes(Set<BauteileZuRohstoffe> bauteileZuRohstoffes) {
        if (this.bauteileZuRohstoffes != null) {
            this.bauteileZuRohstoffes.forEach(i -> i.setBauteil(null));
        }
        if (bauteileZuRohstoffes != null) {
            bauteileZuRohstoffes.forEach(i -> i.setBauteil(this));
        }
        this.bauteileZuRohstoffes = bauteileZuRohstoffes;
    }

    public Bauteil bauteileZuRohstoffes(Set<BauteileZuRohstoffe> bauteileZuRohstoffes) {
        this.setBauteileZuRohstoffes(bauteileZuRohstoffes);
        return this;
    }

    public Bauteil addBauteileZuRohstoffe(BauteileZuRohstoffe bauteileZuRohstoffe) {
        this.bauteileZuRohstoffes.add(bauteileZuRohstoffe);
        bauteileZuRohstoffe.setBauteil(this);
        return this;
    }

    public Bauteil removeBauteileZuRohstoffe(BauteileZuRohstoffe bauteileZuRohstoffe) {
        this.bauteileZuRohstoffes.remove(bauteileZuRohstoffe);
        bauteileZuRohstoffe.setBauteil(null);
        return this;
    }

    public Set<ArtikelZuBauteilmenge> getArtikelZuBauteilmenges() {
        return this.artikelZuBauteilmenges;
    }

    public void setArtikelZuBauteilmenges(Set<ArtikelZuBauteilmenge> artikelZuBauteilmenges) {
        if (this.artikelZuBauteilmenges != null) {
            this.artikelZuBauteilmenges.forEach(i -> i.setBauteil(null));
        }
        if (artikelZuBauteilmenges != null) {
            artikelZuBauteilmenges.forEach(i -> i.setBauteil(this));
        }
        this.artikelZuBauteilmenges = artikelZuBauteilmenges;
    }

    public Bauteil artikelZuBauteilmenges(Set<ArtikelZuBauteilmenge> artikelZuBauteilmenges) {
        this.setArtikelZuBauteilmenges(artikelZuBauteilmenges);
        return this;
    }

    public Bauteil addArtikelZuBauteilmenge(ArtikelZuBauteilmenge artikelZuBauteilmenge) {
        this.artikelZuBauteilmenges.add(artikelZuBauteilmenge);
        artikelZuBauteilmenge.setBauteil(this);
        return this;
    }

    public Bauteil removeArtikelZuBauteilmenge(ArtikelZuBauteilmenge artikelZuBauteilmenge) {
        this.artikelZuBauteilmenges.remove(artikelZuBauteilmenge);
        artikelZuBauteilmenge.setBauteil(null);
        return this;
    }

    public BauteilGruppe getBauteilgruppe() {
        return this.bauteilgruppe;
    }

    public void setBauteilgruppe(BauteilGruppe bauteilGruppe) {
        this.bauteilgruppe = bauteilGruppe;
    }

    public Bauteil bauteilgruppe(BauteilGruppe bauteilGruppe) {
        this.setBauteilgruppe(bauteilGruppe);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Bauteil)) {
            return false;
        }
        return id != null && id.equals(((Bauteil) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Bauteil{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
