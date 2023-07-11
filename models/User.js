const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: { 
        type: String
    },
    admin: {
        type: Boolean, default: false
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    timestamp: {
        type: Date, default: Date.now
    }
});

UserSchema.pre('save', function(next) {
  let user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) return next(err);

          // override the cleartext password with the hashed one
          user.password = hash;
          next();
      });
  });
});

UserSchema.methods.comparePassword = (candidatePassword, cb) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = User = mongoose.model("User", UserSchema)