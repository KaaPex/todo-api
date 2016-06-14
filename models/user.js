"use strict";
module.exports = (sequelize, DataType) => {
  var User = sequelize.define('user', {
    email: {
      type: DataType.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        len: [7, 100]
      }
    }
  }, {
    hooks: {
      beforeValidate: (user, options) => {
        if (typeof user.email === 'string') {
          user.email = user.email.toLowerCase();
        }
      }
    }
  });
  return User;
};
