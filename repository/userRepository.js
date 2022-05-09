const userHelper = require('../helpers/userHelper');
const User = require('../schemas/userSchema');

const postUser = async (data) => {
  let user;
  let err;

  if (!data) {
    err = 'No payload';
    return { user, err };
  }

  const userData = {
    ...data,
    deposit: 0,
    role: 'buyer',
    password: await userHelper.hashUserPassword(data.password),
  };

  try {
    user = await User.create(userData);
  } catch (error) {
    err = error;
  }
  return { user, err };
};

const getUser = async (id) => User.findOne(({ id }));

const getUsers = async () => {
  let users;
  let err;
  try {
    users = await User.find().sort({ createdAt: 'desc' });
  } catch (error) {
    err = error;
  }
  return { users, err };
};

const putUser = async (id, data) => {
  let user; let
    err;

  try {
    user = await User.findOneAndUpdate(
      { _id: id },
      { ...data },
      { new: true },
    );
  } catch (error) {
    err = error;
  }
  return { user, err };
};

const deleteUser = async (id) => {
  let user;
  let err;

  try {
    user = await User.findOneAndDelete(
      { _id: id },
    );
  } catch (error) {
    err = error;
  }
  return { user, err };
};

const userRepository = {
  postUser,
  getUser,
  putUser,
  deleteUser,
  getUsers,
};

module.exports = userRepository;
