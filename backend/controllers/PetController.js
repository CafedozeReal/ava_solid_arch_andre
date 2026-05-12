const Pet = require ('../models/Pet')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


module.exports = class PetController {
    static async createPet(req, res)
    {
        const {nome, age, weight, color, image, avaliable, user} = req.body

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
        if (!image)
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

        const pet = new Pet
        ({
            nome,
            age,
            weight,
            color,
            image,
            avaliable,
            User
        })

        try {
            const newPet = await pet.save()
        } catch (err)
        {
            res.status(503).json({message: err})
        }

        
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