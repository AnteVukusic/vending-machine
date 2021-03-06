const roles = require('../constants/roles');
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

  const { user } = await userRepository.getUser({ name: registerData.name });
  if (user) {
    return {
      err: {
        message: 'User with that name already exists',
        status: 400,
      },
    };
  }

  if (registerData.role === roles.ADMIN) {
    return {
      err: {
        message: 'Cannot register user with admin role without admin permission',
        status: 400,
      },
    };
  }

  return userRepository.postUser({
    ...registerData,
    deposit: 0,
    password: await userHelper.hashUserPassword(registerData.password),
  });
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

  const { user } = await userRepository.getUser({ name: loginData.name });

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
  };
};

const getUsers = async () => userRepository.getUsers();

const getUserPurchases = async (userId, loggedUser) => {
  if (loggedUser.role !== roles.ADMIN && loggedUser.id !== userId) {
    return {
      err: {
        message: 'Cannot retrieve targeted user data',
        status: 400,
      },
    };
  }
  const { user, err } = await userRepository.getUser({ _id: userId });

  if (err) return err;

  return {
    purchases: user.purchases,
  };
};

const getUser = async (userId, loggedUser) => {
  if (loggedUser.role !== roles.ADMIN && loggedUser.id !== userId) {
    return {
      err: {
        message: 'Cannot retrieve targeted user data',
        status: 400,
      },
    };
  }

  return userRepository.getUser({ _id: userId });
};

const depositMoney = async (amount, userId, loggedUser) => {
  if (loggedUser.role !== roles.ADMIN && loggedUser.id !== userId) {
    return {
      err: {
        message: 'Deposit for this account is not possible',
        status: 400,
      },
    };
  }

  const { user } = await userRepository.getUser({ _id: userId });

  if (!user) {
    return {
      err: {
        message: 'Error while retrieving targeted user',
        status: 500,
      },
    };
  }

  return userRepository.putUser(userId, {
    deposit: user.deposit + amount,
  });
};

const resetDeposit = async (userId, loggedUser) => {
  if (loggedUser.role !== roles.ADMIN && loggedUser.id !== userId) {
    return {
      err: {
        message: 'Deposit withdrawl for this account is not possible',
        status: 400,
      },
    };
  }

  const { user } = await userRepository.getUser({ _id: userId });

  if (!user) {
    return {
      err: {
        message: 'Error while retrieving targeted user',
        status: 500,
      },
    };
  }

  return userRepository.putUser(userId, {
    deposit: 0,
  });
};

const userService = {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  depositMoney,
  resetDeposit,
  getUserPurchases,
};

module.exports = userService;
