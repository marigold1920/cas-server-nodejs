module.exports = {
    getDriverDetails:
        "SELECT r.id as requestId, u.display_name as requesterName, u.image_url as requesterImage, r.feedback_driver as feedbackDriver, r.rating_driver as ratingDriver FROM request as r" +
        " inner join user as u on r.requester_id = u.id where r.rating_driver > 0 and r.driver_id = :userId order by r.created_date DESC"
};
