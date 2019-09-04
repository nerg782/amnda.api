import jwt from 'jsonwebtoken';
import randtoken from 'rand-token';

class TokenService {

  createRefreshToken() {
    return randtoken.uid(256);
  }

  createToken(payload, expiresIn = '3d') {
    return jwt.sign(payload, process.env.JWT_TOKEN_SECRET, { expiresIn });
  }

}

module.exports = TokenService;
