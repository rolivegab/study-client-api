import Express from 'express'
import z from 'zod'
import CPF from 'cpf'

const app = Express()

interface User {
  id: number
  name: string
  birthdate: Date
  cpf: string
}

const userValidator = z.object({
  id: z.number({required_error: 'id is required'}),
  name: z.string({required_error: 'name is required'}).nonempty({message: 'name can\'t be empty'}),
  birthdate: z.preprocess((arg) => typeof arg === 'string' && new Date(arg), z.date()),
  cpf: z.string({required_error: 'cpf is required'}).refine(cpf => CPF.isValid(cpf))
})

const users: User[] = []

app.use(Express.json())

app.listen(3001, () => {
  console.log('Agora o servidor está escutando na porta 3001')
})

app.get('/users', (_, res) => {
  res.json(users)
})

app.post('/user', (req, res) => {
  const dadosDoUsuario = userValidator.parse(req.body)
  users.push(dadosDoUsuario)
  try {
    res.json('Usuário "' + dadosDoUsuario.name + '" criado com sucesso!')
  } catch (err) {
    res.json(err)
  }
})