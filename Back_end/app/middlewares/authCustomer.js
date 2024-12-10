function authCustomer(req, res, next) {
    if (req.user.role !== 'customer') {
        return res.status(403).send({ message: "You are not authorized to perform this action." });
    }
    next(); 
}

module.exports = authCustomer;
