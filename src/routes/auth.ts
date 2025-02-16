import { Router, type Request, type Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { verifyEmail, verifyPassword } from '../utils/verifications'
import prisma from '../services/prisma'

const router = Router()

interface AuthController {
  register: (req: Request, res: Response) => void
  login: (req: Request, res: Response) => void
  users: (req: Request, res: Response) => void
}

interface RegisterRequest {
  username: string
  name: string
  email: string
  password: string
}

interface LoginRequest {
  email: string
  password: string
}

const authController: AuthController = {
  register: async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
    const { username, name, email, password } = req.body

    if (!username || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios',
      })
    }

    const emailVerification = verifyEmail(email)
    if (!emailVerification.success) {
      return res.status(400).json({
        success: false,
        message: emailVerification.message,
      })
    }

    const passwordVerification = verifyPassword(password)
    if (!passwordVerification.success) {
      return res.status(400).json({
        success: false,
        message: passwordVerification.message,
      })
    }

    const checkExists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (checkExists) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado',
      })
    }

    const checkUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (checkUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username já cadastrado',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: hashedPassword,
      },
    })

    return res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      user,
    })
  },
  login: async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios',
      })
    }

    const emailVerification = verifyEmail(email)
    if (!emailVerification.success) {
      return res.status(400).json({
        success: false,
        message: emailVerification.message,
      })
    }

    const passwordVerification = verifyPassword(password)
    if (!passwordVerification.success) {
      return res.status(400).json({
        success: false,
        message: passwordVerification.message,
      })
    }

    const exists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!exists) {
      return res.status(400).json({
        success: false,
        message: 'Usuário não encontrado',
      })
    }

    const passwordMatch = await bcrypt.compare(password, exists.password)

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: 'Senha incorreta',
      })
    }

    const token = jwt.sign({ id: exists.id }, process.env.JWT_SECRET as string, {
      expiresIn: '31d',
    })

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
    })
  },
  users: async (req: Request, res: Response) => {
    const users = await prisma.user.findMany()

    return res.status(200).json({
      success: true,
      message: 'Usuários encontrados com sucesso',
      users,
    })
  },
}

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/users', authController.users)

export default router