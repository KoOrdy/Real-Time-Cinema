function authVendor(req, res, next) {
    if (req.user.role !== 'vendor') {
        return res.status(403).send({ message: "You are not authorized to perform this action." });
    }
    next(); 
}

module.exports = authVendor;
