const userHelper = require('../helpers/userHelper');
const User = require('../schemas/userSchema');

const postUser = async (data) => {
  const userData = {
    ...data,
    deposit: 0,
    role: 'buyer',
    password: await userHelper.hashUserPassword(data.password),
  };

  try {
    const user = await User.create(userData);
    return { user };
  } catch (error) {
    return {
      err: {
        message: error,
        status: 500,
      },
    };
  }
};

const getUser = async (query) => User.findOne(({ ...query }));

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
