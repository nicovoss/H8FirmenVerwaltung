package xyz.dulli.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RechnungKopf.
 */
@Entity
@Table(name = "rechnung_kopf")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RechnungKopf implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @OneToMany(mappedBy = "rechnungskopf")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "rechnungskopf", "artikel" }, allowSetters = true)
    private Set<RechnungPositionen> rechnungPositionens = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "rechnungKopfs", "auftragPositionens", "status", "kunde", "bediener" }, allowSetters = true)
    private Auftrag auftrag;

    @ManyToOne
    @JsonIgnoreProperties(value = { "rechnungKopfs", "auftrags" }, allowSetters = true)
    private Bediener bediner;

    @ManyToOne
    @JsonIgnoreProperties(value = { "rechnungKopfs", "auftrags", "organistation" }, allowSetters = true)
    private Patner kunde;

    @ManyToOne
    @JsonIgnoreProperties(value = { "rechnungKopfs", "auftrags" }, allowSetters = true)
    private Status status;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public RechnungKopf id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<RechnungPositionen> getRechnungPositionens() {
        return this.rechnungPositionens;
    }

    public void setRechnungPositionens(Set<RechnungPositionen> rechnungPositionens) {
        if (this.rechnungPositionens != null) {
            this.rechnungPositionens.forEach(i -> i.setRechnungskopf(null));
        }
        if (rechnungPositionens != null) {
            rechnungPositionens.forEach(i -> i.setRechnungskopf(this));
        }
        this.rechnungPositionens = rechnungPositionens;
    }

    public RechnungKopf rechnungPositionens(Set<RechnungPositionen> rechnungPositionens) {
        this.setRechnungPositionens(rechnungPositionens);
        return this;
    }

    public RechnungKopf addRechnungPositionen(RechnungPositionen rechnungPositionen) {
        this.rechnungPositionens.add(rechnungPositionen);
        rechnungPositionen.setRechnungskopf(this);
        return this;
    }

    public RechnungKopf removeRechnungPositionen(RechnungPositionen rechnungPositionen) {
        this.rechnungPositionens.remove(rechnungPositionen);
        rechnungPositionen.setRechnungskopf(null);
        return this;
    }

    public Auftrag getAuftrag() {
        return this.auftrag;
    }

    public void setAuftrag(Auftrag auftrag) {
        this.auftrag = auftrag;
    }

    public RechnungKopf auftrag(Auftrag auftrag) {
        this.setAuftrag(auftrag);
        return this;
    }

    public Bediener getBediner() {
        return this.bediner;
    }

    public void setBediner(Bediener bediener) {
        this.bediner = bediener;
    }

    public RechnungKopf bediner(Bediener bediener) {
        this.setBediner(bediener);
        return this;
    }

    public Patner getKunde() {
        return this.kunde;
    }

    public void setKunde(Patner patner) {
        this.kunde = patner;
    }

    public RechnungKopf kunde(Patner patner) {
        this.setKunde(patner);
        return this;
    }

    public Status getStatus() {
        return this.status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public RechnungKopf status(Status status) {
        this.setStatus(status);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RechnungKopf)) {
            return false;
        }
        return id != null && id.equals(((RechnungKopf) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RechnungKopf{" +
            "id=" + getId() +
            "}";
    }
}
