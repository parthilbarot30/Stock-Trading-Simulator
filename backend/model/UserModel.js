const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, required: [true, "Email required"], unique: true },
  username: { type: String, required: [true, "Username required"] },
  password: { type: String, required: [true, "Password required"] },
  cashBalance: { type: Number, default: 100000 },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

module.exports = mongoose.model("User", userSchema);