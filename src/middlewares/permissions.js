import {decodeJWTToken} from '../helpers/authTools'
import statusCodes from '../constants/statusCodes'

const permissions = {
  isAuthenticated: async (req, res, next) => {
    try {
      const user = decodeJWTToken(req.headers.authorization)
      if (user) {
        req.decoded = user
        next()
      } else {
        res.status(statusCodes.UNAUTHORIZED).send({message: 'Please login to your account.'})
      }
    } catch (error) {
      res.status(statusCodes.UNAUTHORIZED).send({message: 'Please login to your account.'})
    }
  }
}

export default permissions
