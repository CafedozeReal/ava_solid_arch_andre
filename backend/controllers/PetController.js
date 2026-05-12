const Pet = require ('../models/Pet')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { getUserById } = require('./UserController')


module.exports = class PetController {
    static async createPet(req, res)
    {
        const {nome, age, weight, color, avaliable, user} = req.body
        const images = req.files

        if (!nome)
        {
            res.status(422).json({message: 'O nome é obrigatório?'})
            return
        }
        if (!age)
        {
            res.status(422).json({message: 'É nescessário informar a idade'})
            return
        }
        if (!weight)
        {
            res.status(422).json({message: 'O peso é nescessário'})
            return
        }
        if (!color)
        {
            res.status(422).json({message: 'É preciso informar a cor'})
            return
        }
        if (!images || images.lenght === 0)
        {
            res.status(422).json({message: 'É preciso ter uma imagem'})
            return
        }
        if (!avaliable)
        {
            res.status(422).json({message: 'É preciso definir se disponível ou não'})
            return
        }
        if (!user)
        {
            res.status(422).json({message: 'O Pet deve está relacionado à algum usuário'})
            return
        }

        const token = getToken(req)

        const User = await getUserByToken(token)
        const imageFile = images.map((images) => image.filename)

        const pet = new Pet
        ({
            nome,
            age,
            weight,
            color,
            image : imageFile,
            avaliable,
            User: {
                _id: user.id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }
        })

        try {
            const newPet = await pet.save()
            return res.status(201).json({ message: 'Pet Criado com sucesso' })
        } catch (err)
        {
            return res.status(503).json({message: err})
        }

        
    }

    static async getAll(req, res)
    {
        const pets = await Pet.find().sort('-createdAt')

        return res.status(200).json({pets})
    }

    static async getAllUserPet(req, res)
    {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'user._id': user._id}).sort('-createdAt')

        return res.status(200).json({pets})
    }

    static async getAlUserAdoption(req, res)
    {
        const token = getToken(req)
        const user = getUserByToken(token)

        const pet = await Pet.find({'adopter._id' : user._id}).sort('-createdAt')
    }

    static async getPetById(req, res)
    {
        const {id} = req.params

        if (!mongoose.Types.ObjectId.isValid(id))
        {
            return res.status(422).json({message: "Esse Id não é válido"})
        }

        const pet = await Pet.findById(id)

        if (!pet)
        {
            return res.status(200).json({message: "O Pet não foi encontrado"})
        }

        return res.status(200).json({pet})
    }

    static async removePetById(req, res)
    {
        const pet = this.getPetById(req, res)

        const token = getToken(req)
        const user = getUserById(token)

        if (pet.user._id.toString() !== user._id.toString())
        {
            return res.status(403).json({message: 'Acesso negado! Esse Pet não pertence a esse usuário'})
        }

        try {
        await Pet.findByIdAndDelete(id)
        return res.status(200).json({message: 'Pet removido com sucesso'})
        } catch (err) {
            return res.status(500).json({message: 'Não foi possível excluir esse pet'})
        }
    }

    static async updatePet(req, res)
    {
        const {id} = req.params
        const {name, age, weight, color} = req.body
        const images = req.files

        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(402).json({message: 'Esse Id não é válido'})
        }

        const pet = await Pet.findById(id)

        if (!pet)
        {
            return res.status(404).json({message: 'Esse Pet não foi encontrado'})
        }

        const token = getToken(req)
        const user = await getUserById(token)

        if (pet.User._id.toString() !== user._id.toString())
        {
            return res.status(403).json({message: 'Acesso negado, esse Pet não te pertence'})
        }

        const updateData = {}

        name ? updateData.name = name : null
        age ? updateData.age = age : null
        weight ? updateData.weight = weight : null
        color ? updateData.color = color : null

        if (images && images.lenght > 0)
        {
            updateData.images = images.map((image) => image.filename)
        }

        try {
            const updateData = await Pet.findByIdAndUpdate(id, updateData, {new: true})
        } catch (err)
        {
            return res.status(500).json({message: err.message})
        }
    }

    static async schedule(req, res)
    {
        const pet = this.getPetById(req, res)

        const token = getToken(req)
        const user = getUserById(token)

        if (pet.user._id.toString() === user._id.toString())
        {
            return res.status(422).json({message: 'Não é possível agenter uma visita para si mesmo'})
        }

        if (pet.adopter && pet.adopter._id && pet.adopter._id.toString() === user._id.toString())
        {
            return res.status(422).json({message: 'Você já tem uma visita agendada para esse Pet'})
        }

        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image,
        }

        try {
            await pet.save()
            return res.status(200).json({message: `Visita agendada! Usuário: ${pet.user.name}; Contato: ${pet.user.phone}`})
        } catch (err)
        {
            return res.status(500).json({message: err.message})
        }
    } 


    static async concludeAdoption(req, res)
    {
        const pet = this.getPetById(req, res)

        const token = getToken(req)
        const user = await getUserById(token)

        if (pet.user._id.toString() !== user._id.toString())
        {
            return res.status(403).json({message: 'Acesso negado'})
        }

        try {
            await pet.findByIdAndUpdate(id, {avaliable: false})
            return res.status(200).json({message: 'Adoção finalizada'})
        } catch (err)
        {
            return res.status(500).json({message: err.message})
        }
    }
}