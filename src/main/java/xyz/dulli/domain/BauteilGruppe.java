package xyz.dulli.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BauteilGruppe.
 */
@Entity
@Table(name = "bauteil_gruppe")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class BauteilGruppe implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "bauteilgruppe")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "bauteileZuRohstoffes", "artikelZuBauteilmenges", "bauteilgruppe" }, allowSetters = true)
    private Set<Bauteil> bauteils = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "artikels", "bauteilGruppes" }, allowSetters = true)
    private ArtikelTyp artikelTyp;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BauteilGruppe id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public BauteilGruppe name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Bauteil> getBauteils() {
        return this.bauteils;
    }

    public void setBauteils(Set<Bauteil> bauteils) {
        if (this.bauteils != null) {
            this.bauteils.forEach(i -> i.setBauteilgruppe(null));
        }
        if (bauteils != null) {
            bauteils.forEach(i -> i.setBauteilgruppe(this));
        }
        this.bauteils = bauteils;
    }

    public BauteilGruppe bauteils(Set<Bauteil> bauteils) {
        this.setBauteils(bauteils);
        return this;
    }

    public BauteilGruppe addBauteil(Bauteil bauteil) {
        this.bauteils.add(bauteil);
        bauteil.setBauteilgruppe(this);
        return this;
    }

    public BauteilGruppe removeBauteil(Bauteil bauteil) {
        this.bauteils.remove(bauteil);
        bauteil.setBauteilgruppe(null);
        return this;
    }

    public ArtikelTyp getArtikelTyp() {
        return this.artikelTyp;
    }

    public void setArtikelTyp(ArtikelTyp artikelTyp) {
        this.artikelTyp = artikelTyp;
    }

    public BauteilGruppe artikelTyp(ArtikelTyp artikelTyp) {
        this.setArtikelTyp(artikelTyp);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BauteilGruppe)) {
            return false;
        }
        return id != null && id.equals(((BauteilGruppe) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BauteilGruppe{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
