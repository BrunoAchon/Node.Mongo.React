const getToken =(req) => {
    const authHeader = req.headers.authorization
    const token = authHeader.split(" ")[1] // pela somente a segunda parte do array (ignora a palavra baerer)
    return token
}
module.exports = getToken