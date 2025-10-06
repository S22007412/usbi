<?php
class Validator {
    public static function validateStudent($data) {
        $errors = [];
        
        // Required fields
        if (empty($data['matricula'])) {
            $errors[] = "Matrícula es requerida";
        }
        
        if (empty($data['nombre'])) {
            $errors[] = "Nombre es requerido";
        }
        
        if (empty($data['carrera'])) {
            $errors[] = "Carrera es requerida";
        }
        
        // Validate adeudo (must be numeric and >= 0)
        if (!isset($data['adeudo']) || !is_numeric($data['adeudo']) || $data['adeudo'] < 0) {
            $errors[] = "Adeudo debe ser un número válido mayor o igual a 0";
        }
        
        // Validate folio format (4 digits)
        if (isset($data['folio']) && !empty($data['folio'])) {
            $folioNumber = str_replace('No.', '', $data['folio']);
            if (!preg_match('/^\d{4}$/', $folioNumber)) {
                $errors[] = "Folio debe ser un número de 4 dígitos";
            }
        }
        
        return $errors;
    }
    
    public static function sanitizeString($str) {
        return trim(htmlspecialchars($str, ENT_QUOTES, 'UTF-8'));
    }
    
    public static function sanitizeNumber($num) {
        return filter_var($num, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    }
}
?>