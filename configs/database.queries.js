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
        "WHERE s.name LIKE :status AND (a.license_plate LIKE :keyword OR u.display_name LIKE :keyword) " +
        "ORDER BY a.id DESC LIMIT :offset, :pageSize",
    countAmbulances:
        "SELECT COUNT(*) as count " +
        "FROM ambulance as a INNER JOIN user as u ON a.driver_id = u.id " +
        "INNER JOIN ambulance_status as s ON a.ambulance_status = s.status_code " +
        "WHERE s.name LIKE :status AND (a.license_plate LIKE :keyword OR u.display_name LIKE :keyword)",
    getAmbulanceDetails:
        "SELECT a.id as ambulanceId, u.username, s.status_code as status, a.note, a.identity_card as identityCard, " +
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
        "SELECT (SELECT COUNT(id) AS val FROM request WHERE request_status = 'SUCCESS') / (SELECT COUNT(id) FROM request) * 100 as rate",
    getRequesterHistory:
        "SELECT r.id AS requestId, u.image_url AS userImage, rs.name AS status,  JSON_EXTRACT(r.destination, '$.name') AS destinationName, " +
        "JSON_EXTRACT(r.destination, '$.address') AS address, DATE_FORMAT( r.created_date, '%d/%m/%Y') AS dateCreated " +
        "FROM request AS r INNER JOIN user AS u ON r.requester_id = u.id " +
        "INNER JOIN request_status AS rs ON r.request_status = rs.status_code " +
        "WHERE r.requester_id = :userId ORDER BY r.created_date DESC LIMIT :offset, :pageSize",
    getDriverHistory:
        "SELECT r.id AS requestId, u.image_url AS userImage, rs.name AS status,  JSON_EXTRACT(r.destination, '$.name') AS destinationName, " +
        "JSON_EXTRACT(r.destination, '$.address') AS address, DATE_FORMAT( r.created_date, '%d/%m/%Y') AS dateCreated " +
        "FROM request AS r INNER JOIN user AS u ON r.requester_id = u.id " +
        "INNER JOIN request_status AS rs ON r.request_status = rs.status_code " +
        "WHERE r.driver_id = :userId ORDER BY r.created_date DESC LIMIT :offset, :pageSize",
    getRequestsForAdmin:
        "SELECT r.id, re.display_name AS requesterName, re.image_url AS requesterImage, dr.display_name AS driverName, " +
        "dr.image_url AS driverImage, a.license_plate AS licensePlate, r.is_emergency AS emergency, rs.name AS status " +
        "FROM request AS r INNER JOIN user AS re ON r.requester_id = re.id " +
        "LEFT JOIN user AS dr ON r.driver_id = dr.id " +
        "LEFT JOIN request_status AS rs ON r.request_status = rs.status_code " +
        "LEFT JOIN ambulance AS a ON r.ambulance_id = a.id " +
        "WHERE (dr.display_name LIKE :keyword OR re.display_name LIKE :keyword) AND rs.name LIKE :status ORDER BY r.id DESC LIMIT :offset,:pageSize",
    updateSuccessRateForRequester:
        "UPDATE user SET success_rate = (SELECT COUNT(id) FROM request WHERE requester_id = :userId AND request_status = 'SUCCESS') / " +
        "(SELECT COUNT(id) FROM request WHERE requester_id = :userId) * 100, " +
        "num_of_requests = (SELECT COUNT(id) FROM request WHERE requester_id = :userId) WHERE id = :userId",
    updateSuccessRateForDriver:
        "UPDATE user SET success_rate = (SELECT COUNT(id) FROM request WHERE driver_id = :userId AND request_status = 'SUCCESS') / " +
        "(SELECT COUNT(id) FROM request WHERE driver_id = :userId) * 100, " +
        "num_of_requests = (SELECT COUNT(id) FROM request WHERE driver_id = :userId) WHERE id = :userId",
    checkIsRegistered:
        "SELECT id FROM ambulance WHERE license_plate = :licensePlate AND (ambulance_status = 'ACTIVE' OR ambulance_status = 'CONFIRMING')",
    countRequests:
        "SELECT COUNT(*) AS count " +
        "FROM request AS r INNER JOIN user AS re ON r.requester_id = re.id " +
        "LEFT JOIN user AS dr ON r.driver_id = dr.id " +
        "LEFT JOIN request_status AS rs ON r.request_status = rs.status_code " +
        "LEFT JOIN ambulance AS a ON r.ambulance_id = a.id " +
        "WHERE (dr.display_name LIKE :keyword OR re.display_name LIKE :keyword) AND rs.name LIKE :status",
    updateRating:
        "UPDATE user SET rating_level = (SELECT ROUND(AVG(rating_driver), 1) as average FROM request WHERE driver_id = :userId AND rating_driver > 0) WHERE id = :userId"
};
