module.exports = {
    getDriverDetails:
        "SELECT r.id as requestId, u.display_name as requesterName, u.image_url as requesterImage, r.feedback_driver as feedbackDriver, r.rating_driver as ratingDriver FROM request as r" +
        " INNER JOIN user as u on r.requester_id = u.id WHERE r.rating_driver > 0 AND r.driver_id = :userId ORDER BY r.created_date DESC",
    isJoinInRequest:
        "SELECT id FROM request WHERE request_status = 'PROCESSING' AND (requester_id = :userId OR driver_id = :userId)",
    findByRequesterId:
        "SELECT r.id AS requestId, r.destination, rs.name AS status, r.is_other AS isOther, DATE_FORMAT(r.created_date, '%d/%m/%Y') AS createdDate " +
        "FROM request AS r INNER JOIN request_status AS rs ON r.request_status = rs.status_code " +
        "WHERE requester_id = :userId ORDER BY r.created_date DESC"
};
