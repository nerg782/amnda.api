import { Strategy } from 'passport-http-bearer';

class BearerStrategy extends Strategy {

    constructor() {
        super(BearerStrategy.verify);
    }

    static async verify(accessToken, done) {
        const criteria = {
            devices: { $elemMatch: { accessToken, status: true } },
        };
        const user = await User.findOne(criteria);
        if (!user) {
            return done(new Error('Invalid Token'));
        }
        done(null, accessToken);
    }
}

module.exports = BearerStrategy;
