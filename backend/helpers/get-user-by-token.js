const jwt = require('jsonwebtoken')

const User = require('../models/User')

//get user by jwt
const getUserByToken = async (token) =>{
    if (!token){
        return res.status(401).json({message: 'Acesso Negado!'})
    }
    
    const decoded = jwt.verify(token, "c0l0c@r_um@_s3cr3t_/_n@0_c0l0qu3i_p01s_n@0_eh_o_f0c0")
    const userId = decoded.id
    const user = await User.findOne({_id: userId})
    return user
}

module.exports = getUserByToken