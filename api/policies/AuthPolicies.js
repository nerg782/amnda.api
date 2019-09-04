/* eslint no-underscore-dangle: 0 */

class AuthPolicies {

  role(roles) {
    const rolArray = Array.isArray(roles) ? roles : [roles];
    return async (ctx, next) => {
      const { user } = ctx.state;
      const uRoles = user.roles;
      if (uRoles) {
        let status = false;
        for (let i = 0; i < uRoles.length; i += i) {
          const role = uRoles[i];
          if (rolArray.includes(role)) {
            status = true;
            break;
          }
        }
        if (status) {
          await next();
          return;
        }
      }
      throw new AuthorizationError('InsufficientPrivileges', 'You don\'t have enough privileges to do this action');
    };
  }

  async localAuth(ctx, next) {
    const cb = async (err, data, missingCredentials) => {
        if (missingCredentials) {
            throw new RequestError('MissingFields', 'You have missing some credentials fields.');
        } else if (err) {
            throw err;
        } else {
            const { accessToken, refreshToken, user } = data;
            await user.setDevice({ accessToken, ip: ctx.ip, refreshToken });
            ctx.status = 200;
            ctx.state.data = { accessToken, refreshToken };
            await next();
        }
    };
    return cano.passport.authenticate('local', cb)(ctx, next);
}

  async bearer(ctx, next) {
    const cb = async (err, accessToken) => {
      if (err) {
        if (err.message === 'Invalid Token') {
          throw new AuthorizationError('InvalidAccessToken', 'Token doesnt exist in redis DB');
        }
        throw err;
      } else {
        ctx.state.accessToken = accessToken;
        await next();
      }
    };
    return cano.passport.authenticate('bearer', cb)(ctx, next);
  }

  async jwt(ctx, next) {
    const cb = async (err, payload, info) => {
      const { user } = payload;
      if (info && info.name === 'TokenExpiredError') {
        throw new AuthorizationError('InvalidAccessToken', 'The Authentication token has expired');
      }
      if (info && info.name === 'JsonWebTokenError') {
        throw new AuthorizationError('InvalidAccessToken', 'The Authentication token is invalid or was vulnerated');
      }
      if (info) {
        throw new AuthorizationError('InvalidAccessToken', 'Invalid token, Format is Authorization: Bearer [token]');
      }
      if (err) {
        throw err;
      }
      ctx.state.user = await User.findById(user._id);
      await next();
    };
    return cano.passport.authenticate('jwt', cb)(ctx, next);
  }

}

module.exports = AuthPolicies;
