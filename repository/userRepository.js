const User = require('../schemas/userSchema');

const postUser = async (data) => {
  try {
    const user = await User.create(data);
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
  try {
    const users = await User.find().sort({ createdAt: 'desc' });
    return {
      users,
    };
  } catch (error) {
    return {
      err: {
        message: 'Error while returning users',
        status: 500,
      },
    };
  }
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
