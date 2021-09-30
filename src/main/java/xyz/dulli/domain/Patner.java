package xyz.dulli.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Patner.
 */
@Entity
@Table(name = "patner")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Patner implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "vname")
    private String vname;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "kunde")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "rechnungPositionens", "auftrag", "bediner", "kunde", "status" }, allowSetters = true)
    private Set<RechnungKopf> rechnungKopfs = new HashSet<>();

    @OneToMany(mappedBy = "kunde")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "rechnungKopfs", "auftragPositionens", "status", "kunde", "bediener" }, allowSetters = true)
    private Set<Auftrag> auftrags = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "patners" }, allowSetters = true)
    private Organistation organistation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Patner id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVname() {
        return this.vname;
    }

    public Patner vname(String vname) {
        this.setVname(vname);
        return this;
    }

    public void setVname(String vname) {
        this.vname = vname;
    }

    public String getName() {
        return this.name;
    }

    public Patner name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<RechnungKopf> getRechnungKopfs() {
        return this.rechnungKopfs;
    }

    public void setRechnungKopfs(Set<RechnungKopf> rechnungKopfs) {
        if (this.rechnungKopfs != null) {
            this.rechnungKopfs.forEach(i -> i.setKunde(null));
        }
        if (rechnungKopfs != null) {
            rechnungKopfs.forEach(i -> i.setKunde(this));
        }
        this.rechnungKopfs = rechnungKopfs;
    }

    public Patner rechnungKopfs(Set<RechnungKopf> rechnungKopfs) {
        this.setRechnungKopfs(rechnungKopfs);
        return this;
    }

    public Patner addRechnungKopf(RechnungKopf rechnungKopf) {
        this.rechnungKopfs.add(rechnungKopf);
        rechnungKopf.setKunde(this);
        return this;
    }

    public Patner removeRechnungKopf(RechnungKopf rechnungKopf) {
        this.rechnungKopfs.remove(rechnungKopf);
        rechnungKopf.setKunde(null);
        return this;
    }

    public Set<Auftrag> getAuftrags() {
        return this.auftrags;
    }

    public void setAuftrags(Set<Auftrag> auftrags) {
        if (this.auftrags != null) {
            this.auftrags.forEach(i -> i.setKunde(null));
        }
        if (auftrags != null) {
            auftrags.forEach(i -> i.setKunde(this));
        }
        this.auftrags = auftrags;
    }

    public Patner auftrags(Set<Auftrag> auftrags) {
        this.setAuftrags(auftrags);
        return this;
    }

    public Patner addAuftrag(Auftrag auftrag) {
        this.auftrags.add(auftrag);
        auftrag.setKunde(this);
        return this;
    }

    public Patner removeAuftrag(Auftrag auftrag) {
        this.auftrags.remove(auftrag);
        auftrag.setKunde(null);
        return this;
    }

    public Organistation getOrganistation() {
        return this.organistation;
    }

    public void setOrganistation(Organistation organistation) {
        this.organistation = organistation;
    }

    public Patner organistation(Organistation organistation) {
        this.setOrganistation(organistation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Patner)) {
            return false;
        }
        return id != null && id.equals(((Patner) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Patner{" +
            "id=" + getId() +
            ", vname='" + getVname() + "'" +
            ", name='" + getName() + "'" +
            "}";
    }
}
