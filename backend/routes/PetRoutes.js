const router = require("express").Router();

const PetController = require('../controllers/PetController')

// middlewares 
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

// Pessoas nao logadas nao podem add pets
router.post('/create', verifyToken, imageUpload.array('images') , PetController.create)

router.get('/', PetController.getAll)
router.get('/mypets', verifyToken, PetController.getAllUserPets)
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions)
router.get('/:id', PetController.getPetById)

router.delete('/:id', verifyToken, PetController.deletePetById)
router.patch('/:id', verifyToken, imageUpload.array('images') ,PetController.updatePetById)
router.patch('/schedule/:id', verifyToken, PetController.schedule)

module.exports = router