const adminAuth = (req, res, next) => {
    const token = "abc";
    const isAdminAuthorized = token === "abcd"
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized request")
    }else{
        next()
    }
}
module.exports = {
    adminAuth
}