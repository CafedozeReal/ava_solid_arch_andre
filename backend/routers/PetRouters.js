const router = require('express').Router()

const PetController = require('../controllers/PetController')

const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

router.post('/register', PetController.createPet)
router.get('/myPets', PetController.getAllUserPet)
router.get('/myAdoptions', PetController.getAlUserAdoption)
router.get('/:id', PetController.getPetById)
router.delete('/:id'. verifyToken, PetController.removePetById)
router.patch('/:id', verifyToken, imageUpload.array('images', PetController.updatePet))
router.patch('/schedule/:id', verifyToken, PetController.schedule)
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption)

module.exports = router