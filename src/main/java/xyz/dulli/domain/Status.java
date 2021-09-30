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
 * A Status.
 */
@Entity
@Table(name = "status")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Status implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "status_bez", nullable = false)
    private String statusBez;

    @OneToMany(mappedBy = "status")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "rechnungPositionens", "auftrag", "bediner", "kunde", "status" }, allowSetters = true)
    private Set<RechnungKopf> rechnungKopfs = new HashSet<>();

    @OneToMany(mappedBy = "status")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "rechnungKopfs", "auftragPositionens", "status", "kunde", "bediener" }, allowSetters = true)
    private Set<Auftrag> auftrags = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Status id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatusBez() {
        return this.statusBez;
    }

    public Status statusBez(String statusBez) {
        this.setStatusBez(statusBez);
        return this;
    }

    public void setStatusBez(String statusBez) {
        this.statusBez = statusBez;
    }

    public Set<RechnungKopf> getRechnungKopfs() {
        return this.rechnungKopfs;
    }

    public void setRechnungKopfs(Set<RechnungKopf> rechnungKopfs) {
        if (this.rechnungKopfs != null) {
            this.rechnungKopfs.forEach(i -> i.setStatus(null));
        }
        if (rechnungKopfs != null) {
            rechnungKopfs.forEach(i -> i.setStatus(this));
        }
        this.rechnungKopfs = rechnungKopfs;
    }

    public Status rechnungKopfs(Set<RechnungKopf> rechnungKopfs) {
        this.setRechnungKopfs(rechnungKopfs);
        return this;
    }

    public Status addRechnungKopf(RechnungKopf rechnungKopf) {
        this.rechnungKopfs.add(rechnungKopf);
        rechnungKopf.setStatus(this);
        return this;
    }

    public Status removeRechnungKopf(RechnungKopf rechnungKopf) {
        this.rechnungKopfs.remove(rechnungKopf);
        rechnungKopf.setStatus(null);
        return this;
    }

    public Set<Auftrag> getAuftrags() {
        return this.auftrags;
    }

    public void setAuftrags(Set<Auftrag> auftrags) {
        if (this.auftrags != null) {
            this.auftrags.forEach(i -> i.setStatus(null));
        }
        if (auftrags != null) {
            auftrags.forEach(i -> i.setStatus(this));
        }
        this.auftrags = auftrags;
    }

    public Status auftrags(Set<Auftrag> auftrags) {
        this.setAuftrags(auftrags);
        return this;
    }

    public Status addAuftrag(Auftrag auftrag) {
        this.auftrags.add(auftrag);
        auftrag.setStatus(this);
        return this;
    }

    public Status removeAuftrag(Auftrag auftrag) {
        this.auftrags.remove(auftrag);
        auftrag.setStatus(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Status)) {
            return false;
        }
        return id != null && id.equals(((Status) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Status{" +
            "id=" + getId() +
            ", statusBez='" + getStatusBez() + "'" +
            "}";
    }
}
