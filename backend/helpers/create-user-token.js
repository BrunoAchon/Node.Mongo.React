const jwt = require('jsonwebtoken')

const createUserToken = async(user, req, res) =>{
    // create a token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "c0l0c@r_um@_s3cr3t_/_n@0_c0l0qu3i_p01s_n@0_eh_o_f0c0")

    // return a token
    res.status(200).json({ message: 'Você está autenticado', token: token, userId: user._id })
}
module.exports = createUserToken