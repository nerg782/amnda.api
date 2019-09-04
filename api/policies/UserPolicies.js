class UserPolicies {
  async verifyEmail({ request: { body }, params: { id } }, next) {
    const { email } = body;
    const criteria = { email };
    if (id) {
      Object.assign(criteria, { _id: { $ne: id } });
    }
    const user = await User.findOne(criteria);
    if (user) {
      throw new UserError('EmailAlreadyExists', 'The email entered already exists in the system.');
    }
    await next();
  }
}

module.exports = UserPolicies;
