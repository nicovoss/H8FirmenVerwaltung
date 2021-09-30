package xyz.dulli.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Rohstoff.
 */
@Entity
@Table(name = "rohstoff")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Rohstoff implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "preis")
    private Integer preis;

    @OneToMany(mappedBy = "rohstoff")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "bauteil", "rohstoff" }, allowSetters = true)
    private Set<BauteileZuRohstoffe> bauteileZuRohstoffes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Rohstoff id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Rohstoff name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPreis() {
        return this.preis;
    }

    public Rohstoff preis(Integer preis) {
        this.setPreis(preis);
        return this;
    }

    public void setPreis(Integer preis) {
        this.preis = preis;
    }

    public Set<BauteileZuRohstoffe> getBauteileZuRohstoffes() {
        return this.bauteileZuRohstoffes;
    }

    public void setBauteileZuRohstoffes(Set<BauteileZuRohstoffe> bauteileZuRohstoffes) {
        if (this.bauteileZuRohstoffes != null) {
            this.bauteileZuRohstoffes.forEach(i -> i.setRohstoff(null));
        }
        if (bauteileZuRohstoffes != null) {
            bauteileZuRohstoffes.forEach(i -> i.setRohstoff(this));
        }
        this.bauteileZuRohstoffes = bauteileZuRohstoffes;
    }

    public Rohstoff bauteileZuRohstoffes(Set<BauteileZuRohstoffe> bauteileZuRohstoffes) {
        this.setBauteileZuRohstoffes(bauteileZuRohstoffes);
        return this;
    }

    public Rohstoff addBauteileZuRohstoffe(BauteileZuRohstoffe bauteileZuRohstoffe) {
        this.bauteileZuRohstoffes.add(bauteileZuRohstoffe);
        bauteileZuRohstoffe.setRohstoff(this);
        return this;
    }

    public Rohstoff removeBauteileZuRohstoffe(BauteileZuRohstoffe bauteileZuRohstoffe) {
        this.bauteileZuRohstoffes.remove(bauteileZuRohstoffe);
        bauteileZuRohstoffe.setRohstoff(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Rohstoff)) {
            return false;
        }
        return id != null && id.equals(((Rohstoff) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Rohstoff{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", preis=" + getPreis() +
            "}";
    }
}
