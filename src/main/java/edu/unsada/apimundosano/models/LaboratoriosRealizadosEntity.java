package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "laboratorios_realizados", schema = "tripleconlast", catalog = "")
@IdClass(LaboratoriosRealizadosEntityPK.class)
public class LaboratoriosRealizadosEntity {

    @Basic
    @Id
    @Column(name = "id_persona")
    private int idPersona;

    @Basic
    @Id
    @Column(name = "id_control")
    private int idControl;

    @Basic
    @Id
    @Column(name = "id_laboratorio")
    private int idLaboratorio;

    @Basic
    @Id
    @Column(name = "trimestre")
    private Integer trimestre;
    @Basic
    @Column(name = "fecha_realizado")
    private Date fechaRealizado;
    @Basic
    @Column(name = "fecha_resultados")
    private Date fechaResultados;
    @Basic
    @Column(name = "resultado")
    private String resultado;
    @Basic
    @Id
    @Column(name = "id_etmi")
    private int idEtmi;
    @Basic
    @Column(name = "sql_deleted")
    private Integer sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @ManyToOne
    @JoinColumn(name = "id_persona", referencedColumnName = "id_persona", nullable = false,insertable=false, updatable=false)

    private PersonasEntity personasByIdPersona;
    @ManyToOne
    @JoinColumn(name = "id_control", referencedColumnName = "id_control", nullable = false,insertable=false, updatable=false)

    private ControlesEntity controlesByIdControl;
    @ManyToOne
    @JoinColumn(name = "id_laboratorio", referencedColumnName = "id_laboratorio", nullable = false,insertable=false, updatable=false)

    private LaboratoriosEntity laboratoriosByIdLaboratorio;


    public int getIdPersona() {
        return idPersona;
    }

    public void setIdPersona(int idPersona) {
        this.idPersona = idPersona;
    }

    public int getIdControl() {
        return idControl;
    }

    public void setIdControl(int idControl) {
        this.idControl = idControl;
    }

    public int getIdLaboratorio() {
        return idLaboratorio;
    }

    public void setIdLaboratorio(int idLaboratorio) {
        this.idLaboratorio = idLaboratorio;
    }

    public Integer getTrimestre() {
        return trimestre;
    }

    public void setTrimestre(short trimestre) {
        this.trimestre = (int) trimestre;
    }

    public void setTrimestre(Integer trimestre) {
        this.trimestre = trimestre;
    }

    public Date getFechaRealizado() {
        return fechaRealizado;
    }

    public void setFechaRealizado(Date fechaRealizado) {
        this.fechaRealizado = fechaRealizado;
    }

    public Date getFechaResultados() {
        return fechaResultados;
    }

    public void setFechaResultados(Date fechaResultados) {
        this.fechaResultados = fechaResultados;
    }

    public String getResultado() {
        return resultado;
    }

    public void setResultado(String resultado) {
        this.resultado = resultado;
    }

    public int getIdEtmi() {
        return idEtmi;
    }

    public void setIdEtmi(int idEtmi) {
        this.idEtmi = idEtmi;
    }

    public Integer getSqlDeleted() {
        return sqlDeleted;
    }


    public void setSqlDeleted(Integer sqlDeleted) {
        this.sqlDeleted = sqlDeleted;
    }

    public Integer getLastModified() {
        return lastModified;
    }

    public void setLastModified(Integer lastModified) {
        this.lastModified = lastModified;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        LaboratoriosRealizadosEntity that = (LaboratoriosRealizadosEntity) o;

        if (idPersona != that.idPersona) return false;
        if (idControl != that.idControl) return false;
        if (idLaboratorio != that.idLaboratorio) return false;
        if (trimestre != that.trimestre) return false;
        if (idEtmi != that.idEtmi) return false;
        if (fechaRealizado != null ? !fechaRealizado.equals(that.fechaRealizado) : that.fechaRealizado != null)
            return false;
        if (fechaResultados != null ? !fechaResultados.equals(that.fechaResultados) : that.fechaResultados != null)
            return false;
        if (resultado != null ? !resultado.equals(that.resultado) : that.resultado != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idPersona;
        result = 31 * result + idControl;
        result = 31 * result + idLaboratorio;
        result = 31 * result + (int) trimestre;
        result = 31 * result + (fechaRealizado != null ? fechaRealizado.hashCode() : 0);
        result = 31 * result + (fechaResultados != null ? fechaResultados.hashCode() : 0);
        result = 31 * result + (resultado != null ? resultado.hashCode() : 0);
        result = 31 * result + idEtmi;
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public PersonasEntity getPersonasByIdPersona() {
        return personasByIdPersona;
    }

    public void setPersonasByIdPersona(PersonasEntity personasByIdPersona) {
        this.personasByIdPersona = personasByIdPersona;
    }

    public ControlesEntity getControlesByIdControl() {
        return controlesByIdControl;
    }

    public void setControlesByIdControl(ControlesEntity controlesByIdControl) {
        this.controlesByIdControl = controlesByIdControl;
    }

    public LaboratoriosEntity getLaboratoriosByIdLaboratorio() {
        return laboratoriosByIdLaboratorio;
    }

    public void setLaboratoriosByIdLaboratorio(LaboratoriosEntity laboratoriosByIdLaboratorio) {
        this.laboratoriosByIdLaboratorio = laboratoriosByIdLaboratorio;
    }

    @Override
    public String toString() {
        return "LaboratoriosRealizadosEntity{" +
                "idPersona=" + idPersona +
                ", idControl=" + idControl +
                ", idLaboratorio=" + idLaboratorio +
                ", trimestre=" + trimestre +
                ", fechaRealizado=" + fechaRealizado +
                ", fechaResultados=" + fechaResultados +
                ", resultado='" + resultado + '\'' +
                ", idEtmi=" + idEtmi +
                ", sqlDeleted=" + sqlDeleted +
                ", lastModified=" + lastModified +
                ", personasByIdPersona=" + personasByIdPersona +
                ", controlesByIdControl=" + controlesByIdControl +
                ", laboratoriosByIdLaboratorio=" + laboratoriosByIdLaboratorio +
                '}';
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
