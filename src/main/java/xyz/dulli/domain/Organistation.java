package xyz.dulli.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Organistation.
 */
@Entity
@Table(name = "organistation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Organistation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "orga_id", nullable = false)
    private Integer orgaId;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "organistation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "rechnungKopfs", "auftrags", "organistation" }, allowSetters = true)
    private Set<Patner> patners = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Organistation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getOrgaId() {
        return this.orgaId;
    }

    public Organistation orgaId(Integer orgaId) {
        this.setOrgaId(orgaId);
        return this;
    }

    public void setOrgaId(Integer orgaId) {
        this.orgaId = orgaId;
    }

    public String getName() {
        return this.name;
    }

    public Organistation name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Patner> getPatners() {
        return this.patners;
    }

    public void setPatners(Set<Patner> patners) {
        if (this.patners != null) {
            this.patners.forEach(i -> i.setOrganistation(null));
        }
        if (patners != null) {
            patners.forEach(i -> i.setOrganistation(this));
        }
        this.patners = patners;
    }

    public Organistation patners(Set<Patner> patners) {
        this.setPatners(patners);
        return this;
    }

    public Organistation addPatner(Patner patner) {
        this.patners.add(patner);
        patner.setOrganistation(this);
        return this;
    }

    public Organistation removePatner(Patner patner) {
        this.patners.remove(patner);
        patner.setOrganistation(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Organistation)) {
            return false;
        }
        return id != null && id.equals(((Organistation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Organistation{" +
            "id=" + getId() +
            ", orgaId=" + getOrgaId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
