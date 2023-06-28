import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

interface PayLoad {
  userId: string
  role: string
}

const secret = process.env.SECRET_JWT || ''

export function isNotQueryUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization
  if (!authToken) {
    return res
      .status(401)
      .json({ error: 'Acesso restrito a usuários autenticados' })
  }
  const [, token] = authToken.split(' ')

  try {
    const { role } = verify(token, secret) as PayLoad
    if (role === 'consulta') {
      return res.status(401).json({
        error: 'Usuários de consulta não podem acessar essa funcionalidade'
      })
    }
  } catch (error) {
    return res.status(401).json({ error: 'Token de autenticação inválido' })
  }
  return next()
}
