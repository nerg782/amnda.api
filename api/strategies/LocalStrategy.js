import { Strategy } from 'passport-local';

/**
 * Local Strategy Passport Configuration
 *
 * @class LocalStrategy
 * @author Antonio Mejias
 *
 */
class LocalStrategy extends Strategy {
    constructor() {
        super(LocalStrategy.options(), LocalStrategy.verify);
    }

    /**
     * @method options
     * @description This method is a getter for the options to configure the Strategy
     * @author Antonio Mejias
     */
    static options() {
        return {
            usernameField: 'email',
            passwordField: 'password',
            session: false,
        };
    }

    static async verify(email, password, done) {
        try {
            const user = await User.findOne({ email });
            if (!user || !user.isValidPassword(password)) {
                throw new RequestError('InvalidCredentials', 'The credentials are invalids.');
            }
            const refreshToken = TokenService.createRefreshToken();
            const accessToken = TokenService.createToken({ user: UtilService.pickUserField(user.toJSON()) });
            return done(null, { accessToken, refreshToken, user });
        } catch (err) {
            return done(err, null);
        }
    }
}

module.exports = LocalStrategy;
