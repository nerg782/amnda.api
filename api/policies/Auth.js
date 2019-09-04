const { MessageService } = cano.app.services;

class AuthPolice {

    async apikey({ request, res }, next) {
        const { body } = request;
        cano.log.info('AuthPolice');
        res.body = request;
        if (body.token) {
            await next();
        } else if (request.query) {
            await next();
        } else {
            await next(new Error('Tocken not found'));
        }
    }

    async bearer(ctx, next) {
        const cb = async (err) => {
            if (err) {
                cano.log.error(err);
                if (err.message === 'Invalid Token') {
                    ctx.status = 401;
                    ctx.body = {
                        message: 'Invalid token',
                        code: 'InvalidAccessToken',
                    };
                    return;
                }
                ctx.status = 500;
                ctx.body = err;
            } else {
                await next();
            }
        };
        return cano.passport.authenticate('bearer', cb)(ctx, next);
    }
}

module.exports = AuthPolice;
