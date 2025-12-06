const mongoose = require("mongoose");
// temporarily remove bcrypt hook to debug
// const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 }
  },
  { timestamps: true }
);

// REMOVE any userSchema.pre("save", ...) blocks for now
const bcrypt = require("bcrypt");

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function (candidatePassword) {
  // temporary plain-text comparison
  return Promise.resolve(candidatePassword === this.password);
};

module.exports = mongoose.model("User", userSchema);
