package edu.unsada.apimundosano.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.sql.Date;
import java.util.Collection;

@Entity
@Table(name = "controles", schema = "tripleconlast", catalog = "")
public class ControlesEntity {

    @Id
    @Column(name = "id_control")
    private int idControl;
    @Basic
    @Column(name = "fecha")
    private Date fecha;
    @Basic
    @Column(name = "id_persona")
    private int idPersona;
    @Basic
    @Column(name = "control_numero")
    private int controlNumero;
    @Basic
    @Column(name = "id_estado")
    private Integer idEstado;
    @Basic
    @Column(name = "id_seguimiento_chagas")
    private Integer idSeguimientoChagas;
    @Basic
    @Column(name = "id_tratamiento_chagas")
    private Integer idTratamientoChagas;
    @Basic
    @Column(name = "id_seguimiento_hiv")
    private Integer idSeguimientoHiv;
    @Basic
    @Column(name = "id_tratamiento_hiv")
    private Integer idTratamientoHiv;
    @Basic
    @Column(name = "id_seguimiento_sifilis")
    private Integer idSeguimientoSifilis;
    @Basic
    @Column(name = "id_tratamiento_sifilis")
    private Integer idTratamientoSifilis;
    @Basic
    @Column(name = "id_seguimiento_vhb")
    private Integer idSeguimientoVhb;
    @Basic
    @Column(name = "id_tratamiento_vhb")
    private Integer idTratamientoVhb;
    @Basic
    @Column(name = "fecha_fin_embarazo")
    private Date fechaFinEmbarazo;
    @Basic
    @Column(name = "id_tipos_fin_embarazos")
    private Integer idTiposFinEmbarazos;
    @Basic
    @Column(name = "georeferencia")
    private String georeferencia;
    @Basic
    @Column(name = "sql_deleted")
    private Integer sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @JsonIgnore
    @OneToMany(mappedBy = "controlesByIdControl")
    private Collection<AntecedentesEntity> antecedentesByIdControl;
    @JsonIgnore
    @OneToMany(mappedBy = "controlesByIdControl")
    private Collection<ControlEmbarazoEntity> controlEmbarazosByIdControl;
    @JsonIgnore
    @OneToMany(mappedBy = "controlesByIdControl")
    private Collection<ControlPuerperioEntity> controlPuerperiosByIdControl;
    @JsonIgnore
    @OneToMany(mappedBy = "controlesByIdControl")
    private Collection<ControlRnEntity> controlRnsByIdControl;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_persona", referencedColumnName = "id_persona", nullable = false,insertable=false, updatable=false)
    private PersonasEntity personasByIdPersona;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_estado", referencedColumnName = "id_estado",insertable=false, updatable=false)
    private EstadosEntity estadosByIdEstado;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_seguimiento_chagas", referencedColumnName = "id_seguimiento_chagas",insertable=false, updatable=false)
    private SeguimientoChagasEntity seguimientoChagasByIdSeguimientoChagas;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_tratamiento_chagas", referencedColumnName = "id_tratamiento_chagas",insertable=false, updatable=false)
    private TratamientoChagasEntity tratamientoChagasByIdTratamientoChagas;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_seguimiento_hiv", referencedColumnName = "id_seguimiento_hiv",insertable=false, updatable=false)
    private SeguimientoHivEntity seguimientoHivByIdSeguimientoHiv;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_tratamiento_hiv", referencedColumnName = "id_tratamiento_hiv",insertable=false, updatable=false)
    private TratamientoHivEntity tratamientoHivByIdTratamientoHiv;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_seguimiento_sifilis", referencedColumnName = "id_seguimiento_sifilis",insertable=false, updatable=false)
    private SeguimientoSifilisEntity seguimientoSifilisByIdSeguimientoSifilis;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_tratamiento_sifilis", referencedColumnName = "id_tratamiento_sifilis",insertable=false, updatable=false)
    private TratamientoSifilisEntity tratamientoSifilisByIdTratamientoSifilis;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_seguimiento_vhb", referencedColumnName = "id_seguimiento_vhb",insertable=false, updatable=false)
    private SeguimientoVhbEntity seguimientoVhbByIdSeguimientoVhb;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_tratamiento_vhb", referencedColumnName = "id_tratamiento_vhb",insertable=false, updatable=false)
    private TratamientoVhbEntity tratamientoVhbByIdTratamientoVhb;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_tipos_fin_embarazos", referencedColumnName = "id_tipos_fin_embarazos",insertable=false, updatable=false)
    private TiposFinEmbarazosEntity tiposFinEmbarazosByIdTiposFinEmbarazos;
    @JsonIgnore
    @OneToMany(mappedBy = "controlesByIdControl")
    private Collection<EmbarazosEntity> embarazosByIdControl;
    @JsonIgnore
    @OneToMany(mappedBy = "controlesByIdControl")
    private Collection<EtmisPersonasEntity> etmisPersonasByIdControl;
    @JsonIgnore
    @OneToMany(mappedBy = "controlesByIdControl")
    private Collection<InmunizacionesControlEntity> inmunizacionesControlsByIdControl;
    @JsonIgnore
    @OneToMany(mappedBy = "controlesByIdControl")
    private Collection<LaboratoriosRealizadosEntity> laboratoriosRealizadosByIdControl;

    public int getIdControl() {
        return idControl;
    }

    public void setIdControl(int idControl) {
        this.idControl = idControl;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public int getIdPersona() {
        return idPersona;
    }

    public void setIdPersona(int idPersona) {
        this.idPersona = idPersona;
    }

    public int getControlNumero() {
        return controlNumero;
    }

    public void setControlNumero(int controlNumero) {
        this.controlNumero = controlNumero;
    }

    public Integer getIdEstado() {
        return idEstado;
    }

    public void setIdEstado(Integer idEstado) {
        this.idEstado = idEstado;
    }

    public Integer getIdSeguimientoChagas() {
        return idSeguimientoChagas;
    }

    public void setIdSeguimientoChagas(Integer idSeguimientoChagas) {
        this.idSeguimientoChagas = idSeguimientoChagas;
    }

    public Integer getIdTratamientoChagas() {
        return idTratamientoChagas;
    }

    public void setIdTratamientoChagas(Integer idTratamientoChagas) {
        this.idTratamientoChagas = idTratamientoChagas;
    }

    public Integer getIdSeguimientoHiv() {
        return idSeguimientoHiv;
    }

    public void setIdSeguimientoHiv(Integer idSeguimientoHiv) {
        this.idSeguimientoHiv = idSeguimientoHiv;
    }

    public Integer getIdTratamientoHiv() {
        return idTratamientoHiv;
    }

    public void setIdTratamientoHiv(Integer idTratamientoHiv) {
        this.idTratamientoHiv = idTratamientoHiv;
    }

    public Integer getIdSeguimientoSifilis() {
        return idSeguimientoSifilis;
    }

    public void setIdSeguimientoSifilis(Integer idSeguimientoSifilis) {
        this.idSeguimientoSifilis = idSeguimientoSifilis;
    }

    public Integer getIdTratamientoSifilis() {
        return idTratamientoSifilis;
    }

    public void setIdTratamientoSifilis(Integer idTratamientoSifilis) {
        this.idTratamientoSifilis = idTratamientoSifilis;
    }

    public Integer getIdSeguimientoVhb() {
        return idSeguimientoVhb;
    }

    public void setIdSeguimientoVhb(Integer idSeguimientoVhb) {
        this.idSeguimientoVhb = idSeguimientoVhb;
    }

    public Integer getIdTratamientoVhb() {
        return idTratamientoVhb;
    }

    public void setIdTratamientoVhb(Integer idTratamientoVhb) {
        this.idTratamientoVhb = idTratamientoVhb;
    }

    public Date getFechaFinEmbarazo() {
        return fechaFinEmbarazo;
    }

    public void setFechaFinEmbarazo(Date fechaFinEmbarazo) {
        this.fechaFinEmbarazo = fechaFinEmbarazo;
    }

    public Integer getIdTiposFinEmbarazos() {
        return idTiposFinEmbarazos;
    }

    public void setIdTiposFinEmbarazos(Integer idTiposFinEmbarazos) {
        this.idTiposFinEmbarazos = idTiposFinEmbarazos;
    }

    public String getGeoreferencia() {
        return georeferencia;
    }

    public void setGeoreferencia(String georeferencia) {
        this.georeferencia = georeferencia;
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

        ControlesEntity that = (ControlesEntity) o;

        if (idControl != that.idControl) return false;
        if (idPersona != that.idPersona) return false;
        if (controlNumero != that.controlNumero) return false;
        if (fecha != null ? !fecha.equals(that.fecha) : that.fecha != null) return false;
        if (idEstado != null ? !idEstado.equals(that.idEstado) : that.idEstado != null) return false;
        if (idSeguimientoChagas != null ? !idSeguimientoChagas.equals(that.idSeguimientoChagas) : that.idSeguimientoChagas != null)
            return false;
        if (idTratamientoChagas != null ? !idTratamientoChagas.equals(that.idTratamientoChagas) : that.idTratamientoChagas != null)
            return false;
        if (idSeguimientoHiv != null ? !idSeguimientoHiv.equals(that.idSeguimientoHiv) : that.idSeguimientoHiv != null)
            return false;
        if (idTratamientoHiv != null ? !idTratamientoHiv.equals(that.idTratamientoHiv) : that.idTratamientoHiv != null)
            return false;
        if (idSeguimientoSifilis != null ? !idSeguimientoSifilis.equals(that.idSeguimientoSifilis) : that.idSeguimientoSifilis != null)
            return false;
        if (idTratamientoSifilis != null ? !idTratamientoSifilis.equals(that.idTratamientoSifilis) : that.idTratamientoSifilis != null)
            return false;
        if (idSeguimientoVhb != null ? !idSeguimientoVhb.equals(that.idSeguimientoVhb) : that.idSeguimientoVhb != null)
            return false;
        if (idTratamientoVhb != null ? !idTratamientoVhb.equals(that.idTratamientoVhb) : that.idTratamientoVhb != null)
            return false;
        if (fechaFinEmbarazo != null ? !fechaFinEmbarazo.equals(that.fechaFinEmbarazo) : that.fechaFinEmbarazo != null)
            return false;
        if (idTiposFinEmbarazos != null ? !idTiposFinEmbarazos.equals(that.idTiposFinEmbarazos) : that.idTiposFinEmbarazos != null)
            return false;
        if (georeferencia != null ? !georeferencia.equals(that.georeferencia) : that.georeferencia != null)
            return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idControl;
        result = 31 * result + (fecha != null ? fecha.hashCode() : 0);
        result = 31 * result + idPersona;
        result = 31 * result + controlNumero;
        result = 31 * result + (idEstado != null ? idEstado.hashCode() : 0);
        result = 31 * result + (idSeguimientoChagas != null ? idSeguimientoChagas.hashCode() : 0);
        result = 31 * result + (idTratamientoChagas != null ? idTratamientoChagas.hashCode() : 0);
        result = 31 * result + (idSeguimientoHiv != null ? idSeguimientoHiv.hashCode() : 0);
        result = 31 * result + (idTratamientoHiv != null ? idTratamientoHiv.hashCode() : 0);
        result = 31 * result + (idSeguimientoSifilis != null ? idSeguimientoSifilis.hashCode() : 0);
        result = 31 * result + (idTratamientoSifilis != null ? idTratamientoSifilis.hashCode() : 0);
        result = 31 * result + (idSeguimientoVhb != null ? idSeguimientoVhb.hashCode() : 0);
        result = 31 * result + (idTratamientoVhb != null ? idTratamientoVhb.hashCode() : 0);
        result = 31 * result + (fechaFinEmbarazo != null ? fechaFinEmbarazo.hashCode() : 0);
        result = 31 * result + (idTiposFinEmbarazos != null ? idTiposFinEmbarazos.hashCode() : 0);
        result = 31 * result + (georeferencia != null ? georeferencia.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<AntecedentesEntity> getAntecedentesByIdControl() {
        return antecedentesByIdControl;
    }

    public void setAntecedentesByIdControl(Collection<AntecedentesEntity> antecedentesByIdControl) {
        this.antecedentesByIdControl = antecedentesByIdControl;
    }

    public Collection<ControlEmbarazoEntity> getControlEmbarazosByIdControl() {
        return controlEmbarazosByIdControl;
    }

    public void setControlEmbarazosByIdControl(Collection<ControlEmbarazoEntity> controlEmbarazosByIdControl) {
        this.controlEmbarazosByIdControl = controlEmbarazosByIdControl;
    }

    public Collection<ControlPuerperioEntity> getControlPuerperiosByIdControl() {
        return controlPuerperiosByIdControl;
    }

    public void setControlPuerperiosByIdControl(Collection<ControlPuerperioEntity> controlPuerperiosByIdControl) {
        this.controlPuerperiosByIdControl = controlPuerperiosByIdControl;
    }

    public Collection<ControlRnEntity> getControlRnsByIdControl() {
        return controlRnsByIdControl;
    }

    public void setControlRnsByIdControl(Collection<ControlRnEntity> controlRnsByIdControl) {
        this.controlRnsByIdControl = controlRnsByIdControl;
    }

    public PersonasEntity getPersonasByIdPersona() {
        return personasByIdPersona;
    }

    public void setPersonasByIdPersona(PersonasEntity personasByIdPersona) {
        this.personasByIdPersona = personasByIdPersona;
    }

    public EstadosEntity getEstadosByIdEstado() {
        return estadosByIdEstado;
    }

    public void setEstadosByIdEstado(EstadosEntity estadosByIdEstado) {
        this.estadosByIdEstado = estadosByIdEstado;
    }

    public SeguimientoChagasEntity getSeguimientoChagasByIdSeguimientoChagas() {
        return seguimientoChagasByIdSeguimientoChagas;
    }

    public void setSeguimientoChagasByIdSeguimientoChagas(SeguimientoChagasEntity seguimientoChagasByIdSeguimientoChagas) {
        this.seguimientoChagasByIdSeguimientoChagas = seguimientoChagasByIdSeguimientoChagas;
    }

    public TratamientoChagasEntity getTratamientoChagasByIdTratamientoChagas() {
        return tratamientoChagasByIdTratamientoChagas;
    }

    public void setTratamientoChagasByIdTratamientoChagas(TratamientoChagasEntity tratamientoChagasByIdTratamientoChagas) {
        this.tratamientoChagasByIdTratamientoChagas = tratamientoChagasByIdTratamientoChagas;
    }

    public SeguimientoHivEntity getSeguimientoHivByIdSeguimientoHiv() {
        return seguimientoHivByIdSeguimientoHiv;
    }

    public void setSeguimientoHivByIdSeguimientoHiv(SeguimientoHivEntity seguimientoHivByIdSeguimientoHiv) {
        this.seguimientoHivByIdSeguimientoHiv = seguimientoHivByIdSeguimientoHiv;
    }

    public TratamientoHivEntity getTratamientoHivByIdTratamientoHiv() {
        return tratamientoHivByIdTratamientoHiv;
    }

    public void setTratamientoHivByIdTratamientoHiv(TratamientoHivEntity tratamientoHivByIdTratamientoHiv) {
        this.tratamientoHivByIdTratamientoHiv = tratamientoHivByIdTratamientoHiv;
    }

    public SeguimientoSifilisEntity getSeguimientoSifilisByIdSeguimientoSifilis() {
        return seguimientoSifilisByIdSeguimientoSifilis;
    }

    public void setSeguimientoSifilisByIdSeguimientoSifilis(SeguimientoSifilisEntity seguimientoSifilisByIdSeguimientoSifilis) {
        this.seguimientoSifilisByIdSeguimientoSifilis = seguimientoSifilisByIdSeguimientoSifilis;
    }

    public TratamientoSifilisEntity getTratamientoSifilisByIdTratamientoSifilis() {
        return tratamientoSifilisByIdTratamientoSifilis;
    }

    public void setTratamientoSifilisByIdTratamientoSifilis(TratamientoSifilisEntity tratamientoSifilisByIdTratamientoSifilis) {
        this.tratamientoSifilisByIdTratamientoSifilis = tratamientoSifilisByIdTratamientoSifilis;
    }

    public SeguimientoVhbEntity getSeguimientoVhbByIdSeguimientoVhb() {
        return seguimientoVhbByIdSeguimientoVhb;
    }

    public void setSeguimientoVhbByIdSeguimientoVhb(SeguimientoVhbEntity seguimientoVhbByIdSeguimientoVhb) {
        this.seguimientoVhbByIdSeguimientoVhb = seguimientoVhbByIdSeguimientoVhb;
    }

    public TratamientoVhbEntity getTratamientoVhbByIdTratamientoVhb() {
        return tratamientoVhbByIdTratamientoVhb;
    }

    public void setTratamientoVhbByIdTratamientoVhb(TratamientoVhbEntity tratamientoVhbByIdTratamientoVhb) {
        this.tratamientoVhbByIdTratamientoVhb = tratamientoVhbByIdTratamientoVhb;
    }

    public TiposFinEmbarazosEntity getTiposFinEmbarazosByIdTiposFinEmbarazos() {
        return tiposFinEmbarazosByIdTiposFinEmbarazos;
    }

    public void setTiposFinEmbarazosByIdTiposFinEmbarazos(TiposFinEmbarazosEntity tiposFinEmbarazosByIdTiposFinEmbarazos) {
        this.tiposFinEmbarazosByIdTiposFinEmbarazos = tiposFinEmbarazosByIdTiposFinEmbarazos;
    }

    public Collection<EmbarazosEntity> getEmbarazosByIdControl() {
        return embarazosByIdControl;
    }

    public void setEmbarazosByIdControl(Collection<EmbarazosEntity> embarazosByIdControl) {
        this.embarazosByIdControl = embarazosByIdControl;
    }

    public Collection<EtmisPersonasEntity> getEtmisPersonasByIdControl() {
        return etmisPersonasByIdControl;
    }

    public void setEtmisPersonasByIdControl(Collection<EtmisPersonasEntity> etmisPersonasByIdControl) {
        this.etmisPersonasByIdControl = etmisPersonasByIdControl;
    }

    public Collection<InmunizacionesControlEntity> getInmunizacionesControlsByIdControl() {
        return inmunizacionesControlsByIdControl;
    }

    public void setInmunizacionesControlsByIdControl(Collection<InmunizacionesControlEntity> inmunizacionesControlsByIdControl) {
        this.inmunizacionesControlsByIdControl = inmunizacionesControlsByIdControl;
    }

    public Collection<LaboratoriosRealizadosEntity> getLaboratoriosRealizadosByIdControl() {
        return laboratoriosRealizadosByIdControl;
    }

    public void setLaboratoriosRealizadosByIdControl(Collection<LaboratoriosRealizadosEntity> laboratoriosRealizadosByIdControl) {
        this.laboratoriosRealizadosByIdControl = laboratoriosRealizadosByIdControl;
    }
}
