const Pet = require ('../models/Pet')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


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

    }

    static async getAlUserAdoption(req, res)
    {

    }

    static async getPetById(req, res)
    {

    }

    static async removePetById(req, res)
    {

    }

    static async updatePet(req, res)
    {

    }

    static async schedule(req, res)
    {

    }

    static async concludeAdoption(req, res)
    {
        
    }
}