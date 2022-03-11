const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

//middlewares
const checkToken = (req, res, next) =>{
    if(!req.headers.authorization) { // previnir erros de pagina
        return res.status(401).json({message: 'Acesso Negado!'})
    }
    
    const token = getToken(req)
    if (!token){
        return res.status(401).json({message: 'Acesso Negado!'})
    }

    try{
        const verified = jwt.verify(token, "c0l0c@r_um@_s3cr3t_/_n@0_c0l0qu3i_p01s_n@0_eh_o_f0c0")
        req.user = verified
        next()
    } catch(err) {
        return res.status(400).json( { message: `Token inválido!` } )
    }

}
module.exports = checkToken