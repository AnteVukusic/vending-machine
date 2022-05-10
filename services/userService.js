const userHelper = require('../helpers/userHelper');
const userRepository = require('../repository/userRepository');

const registerUser = async (registerData) => {
  const isDataValid = userHelper.validateRegisterModel(registerData);
  if (!isDataValid) {
    return {
      err: {
        message: 'Registration data is not valid',
        status: 400,
      },
    };
  }

  const user = await userRepository.getUser({ name: registerData.name });
  if (user) {
    return {
      err: {
        message: 'User with that name already exists',
        status: 400,
      },
    };
  }

  return userRepository.postUser(registerData);
};

const loginUser = async (loginData) => {
  const isDataValid = userHelper.validateLoginModel(loginData);
  if (!isDataValid) {
    return {
      err: {
        message: 'Registration data is not valid',
        status: 400,
      },
    };
  }

  const user = await userRepository.getUser({ name: loginData.name });

  if (!user) {
    return {
      err: {
        message: 'No user found with that name',
        status: 404,
      },
    };
  }

  const doPasswordsMatch = await userHelper.doPasswordsMatch(loginData.password, user.password);
  if (!doPasswordsMatch) {
    return {
      err: {
        message: 'Passwords do not match',
        status: 400,
      },
    };
  }

  return {
    user,
    token: userHelper.generateSessionToken(user),
  };
};

const userService = {
  registerUser,
  loginUser,
};

module.exports = userService;
