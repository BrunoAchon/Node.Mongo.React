const Pet = require("../models/Pet");

const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class PetController {
    static async create(req, res) {
        const { name, age, weight, color } = req.body;
        const images = req.files;
        const available = true;

        // images upload

        // validation
        if (!name) {
            res.status(422).json({ message: "O nome é obrigatório!" });
            return;
        }
        if (!age) {
            res.status(422).json({ message: "A idade é obrigatória!" });
            return;
        }
        if (!weight) {
            res.status(422).json({ message: "O peso é obrigatório!" });
            return;
        }
        if (!color) {
            res.status(422).json({ message: "A cor é obrigatória!" });
            return;
        }
        if (!images || images.length === 0) {
            res.status(422).json({ message: "A imagem é obrigatória!" });
            return;
        }

        // pet owner
        const token = getToken(req);
        const user = await getUserByToken(token);

        // create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            Images: [],
            user: {
                _id: user._id,
                name: user.name,
                Image: user.image,
                phone: user.phone,
            },
        });

        images.map((image) => {
            pet.images.push(image.filename);
        });

        try {
            const newPet = await pet.save();
            res.status(201).json({
                message: "Pet Cadastrado com sucesso!",
                newPet,
            });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async getAll(req, res) {
        const pets = await Pet.find().sort("-createdAt"); // - = do mais novo para o mais velho
        res.status(200).json({
            pets: pets,
        });
    }

    static async getAllUserPets(req, res) {
        // token from user
        const token = getToken(req);
        const user = await getUserByToken(token);

        const pets = await Pet.find({ "user._id": user._id }).sort(
            "-createdAt"
        ); // - = do mais novo para o mais velho
        res.status(200).json({
            pets: pets,
        });
    }

    static async getAllUserAdoptions(req, res) {
        // token from user
        const token = getToken(req);
        const user = await getUserByToken(token);

        const pets = await Pet.find({ "adopter._id": user._id }).sort(
            "-createdAt"
        ); // - = do mais novo para o mais velho
        res.status(200).json({
            pets: pets,
        });
    }

    static async getPetById(req, res) {
        const id = req.params.id;

        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: "ID inválido!" });
            return;
        }

        const pet = await Pet.findOne({ _id: id });
        //check if pet exists
        if (!pet) {
            res.status(404).json({ message: "Pet não encontrado!" });
            return;
        }

        res.status(200).json({
            pet: pet,
        });
    }

    static async deletePetById(req, res) {
        const id = req.params.id;

        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: "ID inválido!" });
            return;
        }

        const pet = await Pet.findOne({ _id: id });
        //check if pet exists
        if (!pet) {
            res.status(404).json({ message: "Pet não encontrado!" });
            return;
        }

        // chect if logged user registered the pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        // console.log(user._id.toString())
        // console.log(pet.user._id.toString())

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({
                message:
                    "Houve um problema em processar sua solicitação, tente novamente mais tarde!",
            });
            return;
        }

        await Pet.findByIdAndDelete(id);
        res.status(200).json({ message: "Pet removido com sucesso!" });
    }

    static async updatePetById(req, res) {
        const id = req.params.id;
        const { name, age, weight, color, available } = req.body;
        const images = req.files;

        const updateData = {};

        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: "ID inválido!" });
            return;
        }

        const pet = await Pet.findOne({ _id: id });
        //check if pet exists
        if (!pet) {
            res.status(404).json({ message: "Pet não encontrado!" });
            return;
        }

        // chect if logged user registered the pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        // console.log(user._id.toString())
        // console.log(pet.user._id.toString())

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({
                message:
                    "Houve um problema em processar sua solicitação, tente novamente mais tarde!",
            });
            return;
        }

        // validation
        if (!name) {
            res.status(422).json({ message: "O nome é obrigatório!" });
            return;
        } else {
            updateData.name = name;
        }
        if (!age) {
            res.status(422).json({ message: "A idade é obrigatória!" });
            return;
        } else {
            updateData.age = age;
        }
        if (!weight) {
            res.status(422).json({ message: "O peso é obrigatório!" });
            return;
        } else {
            updateData.weight = weight;
        }
        if (!color) {
            res.status(422).json({ message: "A cor é obrigatória!" });
            return;
        } else {
            updateData.color = color;
        }
        if (!images || images.length === 0) {
            res.status(422).json({ message: "A imagem é obrigatória!" });
            return;
        } else {
            updateData.images = [];
            images.map((image) => {
                updateData.images.push(image.filename);
            });
        }

        await Pet.findByIdAndUpdate(id, updateData);
        res.status(200).json({ message: "Pet atualizaco com sucesso!" });
    }

    static async schedule(req, res) {
        const id = req.params.id;

        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: "ID inválido!" });
            return;
        }

        const pet = await Pet.findOne({ _id: id });
        //check if pet exists
        if (!pet) {
            res.status(404).json({ message: "Pet não encontrado!" });
            return;
        }

        // check if a user schedule a self pet
        const token = getToken(req);
        const user = await getUserByToken(token);
        if (pet.user._id.equals(user._id)) {
            res.status(422).json({
                message:
                    "Você não pode agendar uma visita com seu proprio pet!",
            });
            return;
        }

        // check if user has already scheduled a visit
        if(pet.adopter){
            if(pet.adopter._id.equals(user._id)){
                res.status(422).json({
                    message:
                        "Você já agendou uma visita com para este pet!",
                });
            }
        }

        // add user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet);
        res.status(200).json({ message: `A visita foi agendada! Contate ${pet.user.name} pelo telefone ${pet.user.phone}.` });
    }
};
