import { Request, Response } from 'express'
import { decode } from 'jsonwebtoken'

export const checkAdminAccessToken = (
    req: Request,
    resp: Response,
    next: () => void
  ): void => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      resp.status(401).json({ error: 'Token não informado' })
      return
    }    
  
    const { userId, role } = decode(token) as { userId: string, role: string }
    
    if (role != 'administrador') {
      resp.status(403).json({ error: 'Acesso negado. Você não é um administrador.' })
      return
    }
    
    req.userId = userId
    next()
  }
  