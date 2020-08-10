'use strict'

const User = use('App/Models/User')

const {validateAll} = use('Validator')

class UserController {
    async create({ request, response }) {
        try {

            const erroMessage = {
                'username.required': 'Este campo é obrigatorio',
                'username.unique': 'Usuário Existente', 
                'username.min': 'o username deve ter mais que 5 caracteres'
            }

            const validation = await validateAll(request.all(), {
                username: 'required|min:5|unique:users',
                email: 'required|email|unique:users',
                password: 'required|min:6'

            }, erroMessage)

            if(validation.fails()) {
                return response.status(401).send({message: validation.messages()})
            }

            const data = request.only(["username", "email", "password"])

            const user = await User.create(data)

            return user
        } catch(err) {
            return response.status(401).send({error: `Erro: ${err.messages}`})
        }
    } 

    async login ({request, response, auth}) {
        try {
            const {email, password} = request.all()

            const validaToken = await auth.attempt(email, password)

            return validaToken
        } catch(err) {
            console.log(err)
            return response.status(500).send({err: `Erro: ${err.message}`})
        }
    }
}

module.exports = UserController
