package edu.unsada.apimundosano.models;



import com.fasterxml.jackson.annotation.JsonIgnore;


import jakarta.persistence.*;
import java.sql.Date;
import java.util.Collection;

@Entity
@Table(name = "personas", schema = "tripleconlast", catalog = "")
public class PersonasEntity {

    @Id
    @Column(name = "id_persona")
    private int idPersona;
    @Basic
    @Column(name = "apellido")
    private String apellido;
    @Basic
    @Column(name = "nombre")
    private String nombre;
    @Basic
    @Column(name = "documento")
    private String documento;
    @Basic
    @Column(name = "fecha_nacimiento")
    private Date fechaNacimiento;
    @Basic
    @Column(name = "id_origen")
    private Integer idOrigen;
    @Basic
    @Column(name = "nacionalidad")
    private Integer nacionalidad;
    @Basic
    @Column(name = "sexo")
    private String sexo;
    @Basic
    @Column(name = "madre")
    private Integer madre;
    @Basic
    @Column(name = "alta")
    private Integer alta;
    @Basic
    @Column(name = "nacido_vivo")
    private Integer nacidoVivo;
    @Basic
    @Column(name = "sql_deleted")
    private Integer sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @JsonIgnore
    @OneToMany(mappedBy = "personasByIdPersona")
    private Collection<AntecedentesEntity> antecedentesByIdPersona;
    @JsonIgnore
    @OneToMany(mappedBy = "personasByIdPersona")
    private Collection<ControlesEntity> controlesByIdPersona;
    @JsonIgnore
    @OneToMany(mappedBy = "personasByIdPersona")
    private Collection<EmbarazosEntity> embarazosByIdPersona;
    @JsonIgnore
    @OneToMany(mappedBy = "personasByIdPersona")
    private Collection<EtmisPersonasEntity> etmisPersonasByIdPersona;
    @JsonIgnore
    @OneToMany(mappedBy = "personasByIdPersona")
    private Collection<InmunizacionesControlEntity> inmunizacionesControlsByIdPersona;
    @JsonIgnore
    @OneToMany(mappedBy = "personasByIdPersona")
    private Collection<LaboratoriosRealizadosEntity> laboratoriosRealizadosByIdPersona;

    @Override
    public String toString() {
        return "PersonasEntity{" +
                "idPersona=" + idPersona +
                ", apellido='" + apellido + '\'' +
                ", nombre='" + nombre + '\'' +
                ", documento='" + documento + '\'' +
                ", fechaNacimiento=" + fechaNacimiento +
                ", idOrigen=" + idOrigen +
                ", nacionalidad=" + nacionalidad +
                ", sexo='" + sexo + '\'' +
                ", madre=" + madre +
                ", alta=" + alta +
                ", nacidoVivo=" + nacidoVivo +
                ", sqlDeleted=" + sqlDeleted +
                ", lastModified=" + lastModified +
                ", antecedentesByIdPersona=" + antecedentesByIdPersona +
                ", controlesByIdPersona=" + controlesByIdPersona +
                ", embarazosByIdPersona=" + embarazosByIdPersona +
                ", etmisPersonasByIdPersona=" + etmisPersonasByIdPersona +
                ", inmunizacionesControlsByIdPersona=" + inmunizacionesControlsByIdPersona +
                ", laboratoriosRealizadosByIdPersona=" + laboratoriosRealizadosByIdPersona +
                '}';
    }

    public int getIdPersona() {
        return idPersona;
    }

    public void setIdPersona(int idPersona) {
        this.idPersona = idPersona;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String documento) {
        this.documento = documento;
    }

    public Date getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public Integer getIdOrigen() {
        return idOrigen;
    }

    public void setIdOrigen(Integer idOrigen) {
        this.idOrigen = idOrigen;
    }

    public Integer getNacionalidad() {
        return nacionalidad;
    }

    public void setNacionalidad(Integer nacionalidad) {
        this.nacionalidad = nacionalidad;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public Integer getMadre() {
        return madre;
    }

    public void setMadre(Integer madre) {
        this.madre = madre;
    }


    public Integer getAlta() {
        return alta;
    }

    public void setAlta(Integer alta) {
        this.alta = alta;
    }

    public Integer getNacidoVivo() {
        return nacidoVivo;
    }

    public void setNacidoVivo(Integer nacidoVivo) {
        this.nacidoVivo = nacidoVivo;
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

        PersonasEntity that = (PersonasEntity) o;

        if (idPersona != that.idPersona) return false;
        if (apellido != null ? !apellido.equals(that.apellido) : that.apellido != null) return false;
        if (nombre != null ? !nombre.equals(that.nombre) : that.nombre != null) return false;
        if (documento != null ? !documento.equals(that.documento) : that.documento != null) return false;
        if (fechaNacimiento != null ? !fechaNacimiento.equals(that.fechaNacimiento) : that.fechaNacimiento != null)
            return false;
        if (idOrigen != null ? !idOrigen.equals(that.idOrigen) : that.idOrigen != null) return false;
        if (nacionalidad != null ? !nacionalidad.equals(that.nacionalidad) : that.nacionalidad != null) return false;
        if (sexo != null ? !sexo.equals(that.sexo) : that.sexo != null) return false;
        if (madre != null ? !madre.equals(that.madre) : that.madre != null) return false;
        if (alta != null ? !alta.equals(that.alta) : that.alta != null) return false;
        if (nacidoVivo != null ? !nacidoVivo.equals(that.nacidoVivo) : that.nacidoVivo != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idPersona;
        result = 31 * result + (apellido != null ? apellido.hashCode() : 0);
        result = 31 * result + (nombre != null ? nombre.hashCode() : 0);
        result = 31 * result + (documento != null ? documento.hashCode() : 0);
        result = 31 * result + (fechaNacimiento != null ? fechaNacimiento.hashCode() : 0);
        result = 31 * result + (idOrigen != null ? idOrigen.hashCode() : 0);
        result = 31 * result + (nacionalidad != null ? nacionalidad.hashCode() : 0);
        result = 31 * result + (sexo != null ? sexo.hashCode() : 0);
        result = 31 * result + (madre != null ? madre.hashCode() : 0);
        result = 31 * result + (alta != null ? alta.hashCode() : 0);
        result = 31 * result + (nacidoVivo != null ? nacidoVivo.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<AntecedentesEntity> getAntecedentesByIdPersona() {
        return antecedentesByIdPersona;
    }

    public void setAntecedentesByIdPersona(Collection<AntecedentesEntity> antecedentesByIdPersona) {
        this.antecedentesByIdPersona = antecedentesByIdPersona;
    }

    public Collection<ControlesEntity> getControlesByIdPersona() {
        return controlesByIdPersona;
    }

    public void setControlesByIdPersona(Collection<ControlesEntity> controlesByIdPersona) {
        this.controlesByIdPersona = controlesByIdPersona;
    }

    public Collection<EmbarazosEntity> getEmbarazosByIdPersona() {
        return embarazosByIdPersona;
    }

    public void setEmbarazosByIdPersona(Collection<EmbarazosEntity> embarazosByIdPersona) {
        this.embarazosByIdPersona = embarazosByIdPersona;
    }

    public Collection<EtmisPersonasEntity> getEtmisPersonasByIdPersona() {
        return etmisPersonasByIdPersona;
    }

    public void setEtmisPersonasByIdPersona(Collection<EtmisPersonasEntity> etmisPersonasByIdPersona) {
        this.etmisPersonasByIdPersona = etmisPersonasByIdPersona;
    }

    public Collection<InmunizacionesControlEntity> getInmunizacionesControlsByIdPersona() {
        return inmunizacionesControlsByIdPersona;
    }

    public void setInmunizacionesControlsByIdPersona(Collection<InmunizacionesControlEntity> inmunizacionesControlsByIdPersona) {
        this.inmunizacionesControlsByIdPersona = inmunizacionesControlsByIdPersona;
    }

    public Collection<LaboratoriosRealizadosEntity> getLaboratoriosRealizadosByIdPersona() {
        return laboratoriosRealizadosByIdPersona;
    }

    public void setLaboratoriosRealizadosByIdPersona(Collection<LaboratoriosRealizadosEntity> laboratoriosRealizadosByIdPersona) {
        this.laboratoriosRealizadosByIdPersona = laboratoriosRealizadosByIdPersona;
    }


}
