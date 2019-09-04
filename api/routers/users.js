import Router from 'koa-router';

const router = new Router({ prefix: '/v1/users' });
const { bearer, jwt, role } = AuthPolicies;
const { verifyEmail } = UserPolicies;
const isAdmin = role('admin');

router.post('/', bearer, jwt, isAdmin, verifyEmail, UserController.create);
router.get('/', bearer, jwt, isAdmin, UserController.get);
router.get('/me', bearer, jwt, UserController.getMe);
router.get('/:id', bearer, jwt, isAdmin, UserController.getById);
router.put('/me', bearer, jwt, UserController.updateById);
router.put('/me/password', bearer, jwt, UserController.updateMePassword);
router.put('/:id', bearer, jwt, isAdmin, verifyEmail, UserController.updateById);
router.delete('/:id', bearer, jwt, isAdmin, UserController.deleteById);

module.exports = router;
