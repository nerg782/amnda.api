import pick from 'lodash/pick';

const UserFields = [
  '_id',
  'fullName',
  'email',
  'avatar',
  'roles',
  'status',
];

class UtilService {
  
  getUserFields() {
    return UserFields;
  }

  pickUserField(user) {
    return pick(user, UserFields);
  }
}

module.exports = UtilService;
