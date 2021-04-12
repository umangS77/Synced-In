const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// const baseOptions = {
//   discriminatorKey: 'kind',
//   collection: 'users'
// };

const userSchema = new mongoose.Schema({
    userid: {
      type: String,
      trim: true,

    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullname: {
        type: String,
        required:true,
        trim: true,
      },
      email: {
        type: String,
        required:true,
        trim: true,
      },
      password: {
        type: String,
        required:true,
        trim: true,
      },
      type: {
        type: String,
        required:true,
        trim: true,
      },
      contactNumber: {
        type: Number,
      },
      bio: {
        type: String,
        trim: true,
      },

      education: [],
      
      skills: [{
        type: String,
        trim: true,
      }],
      rating: {
        type: Number,
        default: '0'
      },
      resume: { },

      profileImage: { },
      
      ratingCount: {
        type: Number,
        default: '0'
      }
  },
);



userSchema.pre('save', function(next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  }
  else{
      console.log(err)
      next();
  }
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);

