import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
  },
  {
    timestamps: true,
    // Drop any old indexes not defined here on next sync
    autoIndex: true,
  }
);

// On startup, drop the stale username_1 index if it exists
userSchema.post("index", function () {});

// Hash password before saving — only when password is modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

// Drop the stale username_1 index that causes duplicate key errors on register
User.collection.dropIndex("username_1").catch(() => {
  // Silently ignore if index doesn't exist
});

export default User;
