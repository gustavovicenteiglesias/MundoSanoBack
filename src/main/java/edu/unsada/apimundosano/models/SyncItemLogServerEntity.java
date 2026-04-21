package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sync_item_log_server")
public class SyncItemLogServerEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "sync_batch_id", nullable = false, length = 80)
    private String syncBatchId;

    @Column(name = "tabla", nullable = false, length = 80)
    private String tabla;

    @Column(name = "source_uuid", length = 80)
    private String sourceUuid;

    @Column(name = "id_persona")
    private Integer idPersona;

    @Column(name = "id_control")
    private Integer idControl;

    @Column(name = "id_referencia")
    private Integer idReferencia;

    @Column(name = "estado", nullable = false, length = 30)
    private String estado;

    @Column(name = "motivo", length = 600)
    private String motivo;

    @Column(name = "payload_json", columnDefinition = "TEXT")
    private String payloadJson;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSyncBatchId() {
        return syncBatchId;
    }

    public void setSyncBatchId(String syncBatchId) {
        this.syncBatchId = syncBatchId;
    }

    public String getTabla() {
        return tabla;
    }

    public void setTabla(String tabla) {
        this.tabla = tabla;
    }

    public String getSourceUuid() {
        return sourceUuid;
    }

    public void setSourceUuid(String sourceUuid) {
        this.sourceUuid = sourceUuid;
    }

    public Integer getIdPersona() {
        return idPersona;
    }

    public void setIdPersona(Integer idPersona) {
        this.idPersona = idPersona;
    }

    public Integer getIdControl() {
        return idControl;
    }

    public void setIdControl(Integer idControl) {
        this.idControl = idControl;
    }

    public Integer getIdReferencia() {
        return idReferencia;
    }

    public void setIdReferencia(Integer idReferencia) {
        this.idReferencia = idReferencia;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public String getPayloadJson() {
        return payloadJson;
    }

    public void setPayloadJson(String payloadJson) {
        this.payloadJson = payloadJson;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

