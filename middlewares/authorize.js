const jwt = require('jsonwebtoken')
const model = require('../models/Model.master');

module.exports = authorize;

function authorize(roles = []) {
    // return []
    if (typeof roles === 'number') {
        roles = [roles];
    }
    // authorize based on user role
    return async (req, res, next) => {
        const token = req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, process.env.JWT_KEY);
        const user = await model.User.findByPk(data.sub);
        console.log('TEST: ' + data.sub);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        } else {
            if (roles.indexOf(user.role_id) === -1) {
                return res.status(401).json({ message: 'Unauthorized' });
            } else {
                req.user = user.get();
                next();
            }
        }
    }
}



