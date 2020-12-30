module.exports = {
    getDriverDetails:
        "SELECT r.id as requestId, u.display_name as requesterName, u.image_url as requesterImage, r.feedback_driver as feedbackDriver, r.rating_driver as ratingDriver FROM request as r" +
        " INNER JOIN user as u on r.requester_id = u.id WHERE r.rating_driver > 0 AND r.driver_id = :userId ORDER BY r.created_date DESC",
    isJoinInRequest:
        "SELECT id FROM request WHERE request_status = 'PROCESSING' AND (requester_id = :userId OR driver_id = :userId)",
    findByRequesterId:
        "SELECT r.id AS requestId, r.destination, rs.name AS status, r.is_other AS isOther, DATE_FORMAT(r.created_date, '%d/%m/%Y') AS createdDate " +
        "FROM request AS r INNER JOIN request_status AS rs ON r.request_status = rs.status_code " +
        "WHERE requester_id = :userId ORDER BY r.created_date DESC",
    findAllAmbulanceAndPaging:
        "SELECT a.id, u.display_name as driverName, u.image_url as driverImage, a.license_plate as licensePlate, " +
        "DATE_FORMAT(a.registration_date, '%d/%m/%Y') as registrationDate, DATE_FORMAT(a.expiration_date, '%d/%m/%Y') as expirationDate, s.name as status " +
        "FROM ambulance as a INNER JOIN user as u ON a.driver_id = u.id " +
        "INNER JOIN ambulance_status as s ON a.ambulance_status = s.status_code " +
        "WHERE s.name LIKE :status AND a.license_plate LIKE :keyword " +
        "ORDER BY a.registration_date DESC LIMIT :offset, :pageSize",
    getAmbulanceDetails:
        "SELECT a.id as ambulanceId, u.username, s.name as status, a.note, a.identity_card as identityCard, " +
        "a.driver_license as driverLicense, a.register_license as registerLicense, a.registry_certificate as registryCertificate " +
        "FROM ambulance as a INNER JOIN user as u ON a.driver_id = u.id " +
        "INNER JOIN ambulance_status as s ON a.ambulance_status = s.status_code " +
        "WHERE a.id = :ambulanceId",
    makeRequestReport:
        "SELECT created_date, COUNT(id) as amount FROM request " +
        "WHERE created_date >= :startDate GROUP BY created_date",
    getPopularRegion:
        "SELECT region FROM (SELECT region, COUNT(id) AS val FROM request GROUP BY region) temp_table GROUP BY region HAVING MAX(val)",
    getSuccessRate:
        "SELECT (SELECT COUNT(id) AS val FROM request WHERE request_status = 'SUCCESS') / (SELECT COUNT(id) FROM request) * 100 as rate"
};
