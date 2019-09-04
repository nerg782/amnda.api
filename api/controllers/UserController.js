/* eslint no-underscore-dangle: 0 */

class UserController {

  async changePassword({ request: { body }, params: { id }, response }) {
    const user = await User.getById(id);
    await user.changePassword(body);
    response.status = 204;
  }

  async create({ request: { body }, response }) {
    const user = await User.create(body);
    response.status = 201;
    response.body = UtilService.pickUserField(user.toJSON());
  }

  async get({ request: { query }, response }) {
    const { collection, pagination } = await User.get(query);
    response.set('X-Pagination-Total-Count', pagination['X-0-Total-Count']);
    response.set('X-Pagination-Limit', pagination['X-Pagination-Limit']);
    response.status = 200;
    response.body = collection;
  }

  async getById({ request: { query }, params: { id }, response }) {
    response.status = 200;
    response.body = await User.getById(id, query);
  }

  async getMe({ state, response }) {
    response.status = 200;
    response.body = UtilService.pickUserField(state.user.toJSON());
  }

  async updateMePassword({ state: { user }, response, request: { body } }) {
    await user.changePassword(body);
    response.status = 204;
  }

  async updateById({ params: { id }, state: { user }, request: { body }, response }) {
    if (id) {
      await User.updateById(id, body);
    } else {
      await User.updateById(user._id, body);
    }
    response.status = 204;
  }

  async deleteById({ params: { id }, response }) {
    await User.deleteById(id);
    response.status = 204;
  }

}

module.exports = UserController;
