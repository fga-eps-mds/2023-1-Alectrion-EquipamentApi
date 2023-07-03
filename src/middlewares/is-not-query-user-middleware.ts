import { Request, Response } from 'express'
import { decode } from 'jsonwebtoken'

export const checkIfIsQueryUser = (
  req: Request,
  resp: Response,
  next: () => void
): void => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    resp.status(401).json({ error: 'Token não informado' })
    return
  }

  const { userId, role } = decode(token) as { userId: string; role: string }

  if (role === 'consulta') {
    resp.status(403).json({
      error: 'Usuários de consulta não têm acesso a essa funcionalidade'
    })
    return
  }

  req.userId = userId
  next()
}
