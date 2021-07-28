import jwt from 'jsonwebtoken'

export const generateJWTToken = data => jwt.sign(data, process.env.SECRET, {expiresIn: '24h'})

export const decodeJWTToken = token => token && jwt.verify(token.split(' ')[1], process.env.SECRET)
