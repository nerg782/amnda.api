/* eslint no-use-before-define: 0 */

import _ from 'lodash';
import bcrypt from 'bcryptjs';
import generator from 'generate-password';
import moment from 'moment';
import MongooseModel from 'mongoose-model-class';
import SearchService from 'search-service-mongoose';

class User extends MongooseModel {
  schema() {
    const Device = new MongooseModel.Schema({
      ip: { type: String, require: true, index: true },
      refreshToken: { type: String, require: true, index: true },
      accessToken: { type: String, require: true, index: true },
      status: { type: Boolean, default: true },
    });
    return {
      fullName: { type: String, require: true, index: true },
      email: { type: String, require: true, unique: true, index: true },
      password: { type: String, require: true },
      avatar: { type: String },
      roles: { type: [String], require: true },
      status: { type: Boolean, default: true },
      devices: { type: [Device], default: [] },
    };
  }

  // Life Cycle Documents

  async beforeSave(doc, next) {
    const salt = bcrypt.genSaltSync(10);
    doc.password = bcrypt.hashSync(doc.password, salt);
    next();
  }

  // Instance Methods

  addRefreshToken(refreshToken) {
    const refreshTokens = [...this.refreshTokens, refreshToken];
    return this.model('User').findByIdAndUpdate(this.id, {
      $set: {
        refreshTokens,
      },
    });
  }

  changePassword({ currentPassword, newPassword }) {
    if (!this.isValidPassword(currentPassword)) {
      throw new UserError('CurrentPasswordNotMatch', 'The current password sent does not match');
    }
    this.password = newPassword;
    return this.save();
  }

  disable() {
    return this.model('User').updateById(this.id, { status: false });
  }

  isValidPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  setDevice({ accessToken, ip, refreshToken }) {
    const devices = [...this.devices];
    devices.push({ accessToken, ip, refreshToken });
    return this.model('User').updateOne({ _id: this.id }, { $set: { devices } });
  }

  signOut(accessToken) {
    const { _id, devices } = this;
    for (let i = 0; i < devices.length; i += 1) {
      if (devices[i].accessToken === accessToken) {
        devices[i].status = false;
        break;
      }
    }
    return this.model('User').updateOne({ _id }, { $set: { devices } });
  }

  // Static Methods

  static async deleteById(_id) {
    await this.getById(_id);
    return this.remove({ _id });
  }

  static get(query) {
    const criteria = buildCriteria(query);
    const params = buildParams(query);
    return SearchService.search(this, criteria, params);
  }

  static async getById(_id, query = {}) {
    const user = await SearchService.searchOne(this, { _id }, { ...query, hiddenFields: 'password' });
    if (!user) {
      throw new UserError('UserNotFound', `User ID ${_id}, not found.`);
    }
    return UtilService.pickUserField(user.toJSON());
  }

  static async generatePassword(email) {
    const user = await this.findOne({ email });
    if (!user) {
      throw new UserError('UserNotFound', 'User not found.');
    }
    const newPassword = generator.generate({ length: 10, numbers: true });
    await EmailService.sendNewPassword({
      to: email,
      name: user.fullName,
      password: newPassword,
    });
    user.password = newPassword;
    return user.save();
  }

  static async updateById(_id, data) {
    await this.getById(_id);
    return this.updateOne({ _id }, { $set: UtilService.pickUserField(data) });
  }

  // Configuration Methods Schema

  config(schema) {
    schema.index({ '$**': 'text' });
  }

}

function buildParams(query) {
  const {
    page = 1,
    limit = 10,
    orderBy = '-_id',
    fields = null,
    populations = null,
    isCriteriaPipeline = false,
    all = false,
  } = query;
  let allowedFields;
  if (fields) {
    allowedFields = _.split(fields, ',');
    _.remove(allowedFields, field => field === 'password');
    allowedFields = _.join(allowedFields, ',');
  } else {
    allowedFields = _.join(UtilService.getUserFields(), ',');
  }
  return { page, limit, orderBy, fields: allowedFields, populations, isCriteriaPipeline, all };
}

function buildCriteria({ search, fromDate, toDate, status }) {
  const criteria = {};
  const filterDate = [];
  if (status === 'true') {
    Object.assign(criteria, { status: true });
  }
  if (status === 'false') {
    Object.assign(criteria, { status: false });
  }
  if (search) {
    Object.assign(criteria, { $text: { $search: search } });
  }
  if (fromDate) {
    filterDate.push({
      createdAt: {
        $gte: moment(new Date(fromDate), 'DD-MM-YYYY').toDate(),
      },
    });
  }
  if (toDate) {
    filterDate.push({
      createdAt: {
        $lte: moment(new Date(toDate), 'DD-MM-YYYY').toDate(),
      },
    });
  }
  if (filterDate.length > 0) {
   Object.assign(criteria, { $and: filterDate });
  }
  return criteria;
}

module.exports = User;
