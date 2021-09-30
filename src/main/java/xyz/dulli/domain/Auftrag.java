package xyz.dulli.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Auftrag.
 */
@Entity
@Table(name = "auftrag")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Auftrag implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "erfasst_am")
    private Instant erfasstAm;

    @Column(name = "faellig_am")
    private Instant faelligAm;

    @Column(name = "bezahl")
    private Boolean bezahl;

    @Column(name = "bezahlt_am")
    private Instant bezahltAm;

    @Column(name = "abgeschlossen_am")
    private Instant abgeschlossenAm;

    @Column(name = "kommentar")
    private String kommentar;

    @OneToMany(mappedBy = "auftrag")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "rechnungPositionens", "auftrag", "bediner", "kunde", "status" }, allowSetters = true)
    private Set<RechnungKopf> rechnungKopfs = new HashSet<>();

    @OneToMany(mappedBy = "auftrag")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "auftrag", "artikel" }, allowSetters = true)
    private Set<AuftragPositionen> auftragPositionens = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "rechnungKopfs", "auftrags" }, allowSetters = true)
    private Status status;

    @ManyToOne
    @JsonIgnoreProperties(value = { "rechnungKopfs", "auftrags", "organistation" }, allowSetters = true)
    private Patner kunde;

    @ManyToOne
    @JsonIgnoreProperties(value = { "rechnungKopfs", "auftrags" }, allowSetters = true)
    private Bediener bediener;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Auftrag id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getErfasstAm() {
        return this.erfasstAm;
    }

    public Auftrag erfasstAm(Instant erfasstAm) {
        this.setErfasstAm(erfasstAm);
        return this;
    }

    public void setErfasstAm(Instant erfasstAm) {
        this.erfasstAm = erfasstAm;
    }

    public Instant getFaelligAm() {
        return this.faelligAm;
    }

    public Auftrag faelligAm(Instant faelligAm) {
        this.setFaelligAm(faelligAm);
        return this;
    }

    public void setFaelligAm(Instant faelligAm) {
        this.faelligAm = faelligAm;
    }

    public Boolean getBezahl() {
        return this.bezahl;
    }

    public Auftrag bezahl(Boolean bezahl) {
        this.setBezahl(bezahl);
        return this;
    }

    public void setBezahl(Boolean bezahl) {
        this.bezahl = bezahl;
    }

    public Instant getBezahltAm() {
        return this.bezahltAm;
    }

    public Auftrag bezahltAm(Instant bezahltAm) {
        this.setBezahltAm(bezahltAm);
        return this;
    }

    public void setBezahltAm(Instant bezahltAm) {
        this.bezahltAm = bezahltAm;
    }

    public Instant getAbgeschlossenAm() {
        return this.abgeschlossenAm;
    }

    public Auftrag abgeschlossenAm(Instant abgeschlossenAm) {
        this.setAbgeschlossenAm(abgeschlossenAm);
        return this;
    }

    public void setAbgeschlossenAm(Instant abgeschlossenAm) {
        this.abgeschlossenAm = abgeschlossenAm;
    }

    public String getKommentar() {
        return this.kommentar;
    }

    public Auftrag kommentar(String kommentar) {
        this.setKommentar(kommentar);
        return this;
    }

    public void setKommentar(String kommentar) {
        this.kommentar = kommentar;
    }

    public Set<RechnungKopf> getRechnungKopfs() {
        return this.rechnungKopfs;
    }

    public void setRechnungKopfs(Set<RechnungKopf> rechnungKopfs) {
        if (this.rechnungKopfs != null) {
            this.rechnungKopfs.forEach(i -> i.setAuftrag(null));
        }
        if (rechnungKopfs != null) {
            rechnungKopfs.forEach(i -> i.setAuftrag(this));
        }
        this.rechnungKopfs = rechnungKopfs;
    }

    public Auftrag rechnungKopfs(Set<RechnungKopf> rechnungKopfs) {
        this.setRechnungKopfs(rechnungKopfs);
        return this;
    }

    public Auftrag addRechnungKopf(RechnungKopf rechnungKopf) {
        this.rechnungKopfs.add(rechnungKopf);
        rechnungKopf.setAuftrag(this);
        return this;
    }

    public Auftrag removeRechnungKopf(RechnungKopf rechnungKopf) {
        this.rechnungKopfs.remove(rechnungKopf);
        rechnungKopf.setAuftrag(null);
        return this;
    }

    public Set<AuftragPositionen> getAuftragPositionens() {
        return this.auftragPositionens;
    }

    public void setAuftragPositionens(Set<AuftragPositionen> auftragPositionens) {
        if (this.auftragPositionens != null) {
            this.auftragPositionens.forEach(i -> i.setAuftrag(null));
        }
        if (auftragPositionens != null) {
            auftragPositionens.forEach(i -> i.setAuftrag(this));
        }
        this.auftragPositionens = auftragPositionens;
    }

    public Auftrag auftragPositionens(Set<AuftragPositionen> auftragPositionens) {
        this.setAuftragPositionens(auftragPositionens);
        return this;
    }

    public Auftrag addAuftragPositionen(AuftragPositionen auftragPositionen) {
        this.auftragPositionens.add(auftragPositionen);
        auftragPositionen.setAuftrag(this);
        return this;
    }

    public Auftrag removeAuftragPositionen(AuftragPositionen auftragPositionen) {
        this.auftragPositionens.remove(auftragPositionen);
        auftragPositionen.setAuftrag(null);
        return this;
    }

    public Status getStatus() {
        return this.status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Auftrag status(Status status) {
        this.setStatus(status);
        return this;
    }

    public Patner getKunde() {
        return this.kunde;
    }

    public void setKunde(Patner patner) {
        this.kunde = patner;
    }

    public Auftrag kunde(Patner patner) {
        this.setKunde(patner);
        return this;
    }

    public Bediener getBediener() {
        return this.bediener;
    }

    public void setBediener(Bediener bediener) {
        this.bediener = bediener;
    }

    public Auftrag bediener(Bediener bediener) {
        this.setBediener(bediener);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Auftrag)) {
            return false;
        }
        return id != null && id.equals(((Auftrag) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Auftrag{" +
            "id=" + getId() +
            ", erfasstAm='" + getErfasstAm() + "'" +
            ", faelligAm='" + getFaelligAm() + "'" +
            ", bezahl='" + getBezahl() + "'" +
            ", bezahltAm='" + getBezahltAm() + "'" +
            ", abgeschlossenAm='" + getAbgeschlossenAm() + "'" +
            ", kommentar='" + getKommentar() + "'" +
            "}";
    }
}
