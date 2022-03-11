const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// helpers
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body;

        // region - validations

        if (!name) {
            res.status(422).json({ message: "O nome é obrigatório!" });
            return;
        }
        if (!email) {
            res.status(422).json({ message: "O e-mail é obrigatório!" });
            return;
        }
        if (!phone) {
            res.status(422).json({ message: "O telefone é obrigatório!" });
            return;
        }
        if (!password) {
            res.status(422).json({ message: "A senha é obrigatória!" });
            return;
        }
        if (!confirmpassword) {
            res.status(422).json({ message: "Confirme a senha!" });
            return;
        }
        // validation pass and confpass
        if (password !== confirmpassword) {
            res.status(422).json({
                message: "A senha e a confirmação precisam ser iguais!",
            });
            return;
        }
        // validation user exists
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            res.status(422).json({
                message: "Por favor utilize outro e-mail!",
            });
            return;
        }

        // region - create a password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            phone,
            password: passwordHash,
        });
        try {
            const newUser = await user.save();
            await createUserToken(newUser, req, res);
        } catch (err) {
            res.status(500).json({
                message: "Erro na gravação do usuário",
            });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;
        if (!email) {
            res.status(422).json({ message: "O e-mail é obrigatório!" });
            return;
        }
        if (!password) {
            res.status(422).json({ message: "A senha é obrigatória!" });
            return;
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(422).json({
                message: "Não há usuário cadastrado com este e-mail!",
            });
            return;
        }

        // check password
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            res.status(422).json({
                message: "Senha inválida!",
            });
            return;
        }
        await createUserToken(user, req, res);
    }

    static async checkUser(req, res) {
        // usuario logado
        let currentUser;
        if (req.headers.authorization) {
            //console.log(req.headers.authorization)
            const token = getToken(req);
            const decoded = jwt.verify(
                token,
                "c0l0c@r_um@_s3cr3t_/_n@0_c0l0qu3i_p01s_n@0_eh_o_f0c0"
            );

            currentUser = await User.findById(decoded.id);
            currentUser.password = undefined; // tira a senha para nao devolve-la no res
        } else {
            currentUser = null;
        }

        res.status(200).send(currentUser);
    }

    static async getUserById(req, res) {
        const id = req.params.id;
        const user = await User.findById(id).select("-password");
        //user.password = undefined // poderia ser feito assim tbm

        if (!user) {
            res.status(422).json({
                message: "Usuário não encontrado!",
            });
            return;
        }

        res.status(200).json({ user });
    }

    static async editUserById(req, res) {
        const id = req.params.id;

        // check user
        const token = getToken(req)
        const user = await getUserByToken(token)

        const { name, email, phone, password, confirmpassword } = req.body;
    
        if (req.file){
            user.image = req.file.filename 
        }

        // validations
        if (!name) {
            res.status(422).json({ message: "O nome é obrigatório!" });
            return;
        }
        user.name = name
        if (!email) {
            res.status(422).json({ message: "Por favor utilize seu e-mail!" });
            return;
        }
        // check user
        const userExists = await User.findOne({email: email});
        if (user.email !== email && userExists) {
            res.status(422).json({
                message: "Usuário não encontrado",
            });
            return;
        }
        user.email = email

        if (!phone) {
            res.status(422).json({ message: "O telefone é obrigatório!" });
            return;
        }
        user.phone = phone

        // validation pass and confpass
        if (password !== confirmpassword) {
            res.status(422).json({ message: "As senhas não conferem!"});
            return;
        } else if ( password === confirmpassword && password != null) {
            // create password 
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);
            user.password = passwordHash
        }

        try {
            //update data
            const updatedUser = await User.findOneAndUpdate(
                {_id: user._id},
                { $set: user },
                { new: true}
            )
            res.status(200).json({
                message: 'Usuário atualizado com sucesso!', updatedUser // basicamente não precisa, mas to retornando por padrão
            })
        } catch (err) {
            res.status(500).json({ message: err })
        }
    }
};
