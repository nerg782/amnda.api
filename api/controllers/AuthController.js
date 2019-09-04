class AuthController {

  async signIn({ state, response }) {
    response.body = state.data;
  }

  async signOut({ state: { user, accessToken }, response }) {
    await user.signOut(accessToken);
    response.status = 204;
  }

  async generatePassword({ request, response }) {
    const { body: { email } } = request;
    await User.generatePassword(email);
    response.status = 204;
  }

}

module.exports = AuthController;
