import Router from 'koa-router';

const router = new Router({ prefix: '/v1' });
const { bearer, jwt } = AuthPolicies;
const { localAuth } = AuthPolicies;

router.post('/sign-in', localAuth, AuthController.signIn);
router.post('/sign-out', bearer, jwt, AuthController.signOut);
router.post('/recover-password', AuthController.generatePassword);

module.exports = router;
