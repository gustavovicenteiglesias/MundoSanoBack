package edu.unsada.apimundosano.Controller;

import edu.unsada.apimundosano.service.MigrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class MigrationController {

    @Autowired
    private MigrationService migrationService;

    /**
     * Dispara el proceso de migración de IDs numéricos a UUIDs deterministas.
     * Solo debe ejecutarse una vez para inicializar la base de datos con
     * identidades globales.
     */
    @PostMapping("/migrate-uuids")
    public ResponseEntity<Map<String, Object>> migrateUuids() {
        try {
            Map<String, Integer> stats = migrationService.migrateToDeterministicUuids();
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Migración completada con éxito",
                    "details", stats));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", "Fallo en la migración: " + e.getMessage()));
        }
    }
}
