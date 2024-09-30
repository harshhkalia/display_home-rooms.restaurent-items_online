import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "owner"],
      required: true,
    },
    property: {
      type: String,
      enum: ["Hotel", "Restaurent", ""],
      required: function () {
        return this.role === "owner";
      },
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!candidatePassword || !this.password) {
    throw new Error("Missing password or hash for comparison");
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("user_data", userSchema);
export default userModel;
