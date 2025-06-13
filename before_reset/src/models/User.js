const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: { type: String },
    admin: { type: Boolean, default: false },
    email: { type: String },
    password: { type: String },
    timestamp: { type: Date, default: Date.now },
    tokens: [{
        token: { type: String }, 
    }],
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Number }
});

UserSchema.pre('save', function(next) {
  let user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(process.env.SALT_WORK_FACTOR, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) return next(err);

          user.password = hash;
          next();
      });
  });
});




UserSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id, username: user.username, email:user.email }, process.env.TOKEN_SECRET)
    user.tokens = user.tokens.concat({ token: token })
    await user.save();
}

UserSchema.statics.findByCredentials = async (email, password) => {
    const userExists = await User.findOne({email, password})   
}

UserSchema.methods.comparePassword = function(candidatePassword, cb) { 
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) { 
        if (err) return cb(err); cb(null, isMatch); 
    }); 
};



UserSchema.methods.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 4
}


            
module.exports = User = mongoose.model("User", UserSchema)