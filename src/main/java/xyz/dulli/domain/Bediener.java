package xyz.dulli.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Bediener.
 */
@Entity
@Table(name = "bediener")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Bediener implements Serializable {

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

    @OneToMany(mappedBy = "bediner")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "rechnungPositionens", "auftrag", "bediner", "kunde", "status" }, allowSetters = true)
    private Set<RechnungKopf> rechnungKopfs = new HashSet<>();

    @OneToMany(mappedBy = "bediener")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "rechnungKopfs", "auftragPositionens", "status", "kunde", "bediener" }, allowSetters = true)
    private Set<Auftrag> auftrags = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Bediener id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVname() {
        return this.vname;
    }

    public Bediener vname(String vname) {
        this.setVname(vname);
        return this;
    }

    public void setVname(String vname) {
        this.vname = vname;
    }

    public String getName() {
        return this.name;
    }

    public Bediener name(String name) {
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
            this.rechnungKopfs.forEach(i -> i.setBediner(null));
        }
        if (rechnungKopfs != null) {
            rechnungKopfs.forEach(i -> i.setBediner(this));
        }
        this.rechnungKopfs = rechnungKopfs;
    }

    public Bediener rechnungKopfs(Set<RechnungKopf> rechnungKopfs) {
        this.setRechnungKopfs(rechnungKopfs);
        return this;
    }

    public Bediener addRechnungKopf(RechnungKopf rechnungKopf) {
        this.rechnungKopfs.add(rechnungKopf);
        rechnungKopf.setBediner(this);
        return this;
    }

    public Bediener removeRechnungKopf(RechnungKopf rechnungKopf) {
        this.rechnungKopfs.remove(rechnungKopf);
        rechnungKopf.setBediner(null);
        return this;
    }

    public Set<Auftrag> getAuftrags() {
        return this.auftrags;
    }

    public void setAuftrags(Set<Auftrag> auftrags) {
        if (this.auftrags != null) {
            this.auftrags.forEach(i -> i.setBediener(null));
        }
        if (auftrags != null) {
            auftrags.forEach(i -> i.setBediener(this));
        }
        this.auftrags = auftrags;
    }

    public Bediener auftrags(Set<Auftrag> auftrags) {
        this.setAuftrags(auftrags);
        return this;
    }

    public Bediener addAuftrag(Auftrag auftrag) {
        this.auftrags.add(auftrag);
        auftrag.setBediener(this);
        return this;
    }

    public Bediener removeAuftrag(Auftrag auftrag) {
        this.auftrags.remove(auftrag);
        auftrag.setBediener(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Bediener)) {
            return false;
        }
        return id != null && id.equals(((Bediener) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Bediener{" +
            "id=" + getId() +
            ", vname='" + getVname() + "'" +
            ", name='" + getName() + "'" +
            "}";
    }
}
