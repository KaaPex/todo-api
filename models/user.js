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
      set:function (value)  {
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
    classMethods: {
      authenticate: function (body) {
        return new Promise( (resolve, reject) => {
          if (typeof body.email !== 'string' || typeof body.password !== 'string') {
            return reject();
          }

          User.findOne({
            where: {
              email: body.email
            }
          }).then( (user) => {
            if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
              return reject();
            }
            resolve(user);
          }, (e) => {
            return reject();
          });
        });
      }
    },
    instanceMethods: {
      toPublicJSON: function () {
        let json = this.toJSON();
        return _.pick(json,'id', 'email', 'createdAt', 'updatedAt');
      }
    }
  });
  return User;
};
