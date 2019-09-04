module.exports = {
  UserNotFound: {
    description: 'User not found.',
    status: 404,
  },
  EmailAlreadyExists: {
    description: 'The email entered already exists in the system.',
    status: 409,
  },
  CurrentPasswordNotMatch: {
    description: 'The current password sent does not match.',
    status: 409,
  },
};
