const loginModel = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 4, maxLength: 16 },
    password: { type: 'string', minLength: 8 },
  },
  required: ['name', 'password'],
};

const registerModel = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 4, maxLength: 16 },
    password: { type: 'string', minLength: 8 },
    confirmPassword: {
      type: 'string',
      minLength: 8,
      const: {
        $data: '1/password',
      },
    },
  },
  required: ['name', 'password', 'confirmPassword'],
};

const userModels = {
  loginModel,
  registerModel,
};

module.exports = { userModels };
