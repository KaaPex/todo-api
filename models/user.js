"use strict";
const bcrypt = require('bcrypt');
const _ = require('underscore');

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
    salt: {
      type: DataType.STRING
    },
    password_hash: {
      type: DataType.STRING
    },
    password: {
      type: DataType.VIRTUAL,
      allowNull: false,
      validate: {
        len: [7, 100]
      },
      set: (value) => {
        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashedSync(value, salt);

        this.setDataValue('password', value);
        this.setDataValue('salt', salt);
        this.setDataValue('password_hash', hashedPassword);
      }
    }
  }, {
    hooks: {
      beforeValidate: (user, options) => {
        if (typeof user.email === 'string') {
          user.email = user.email.toLowerCase();
        }
      }
    },
    instanceMethods: {
      toPublicJSON: () => {
        let json = this.toJSON();
        return _.pick(json,'id', 'email', 'createdAt', 'updatedAt');
      }
    }
  });
  return User;
};
