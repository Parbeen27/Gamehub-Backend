const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/models/users.models"); // adjust path
const usersData = require("./seed/seedUser.json"); // 👈 path
require("dotenv").config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo URI ",process.env.MONGO_URI);
    
    console.log("Connected to DB...");

    // optional: clear users
    await User.deleteMany({});

    // hash passwords
    const users = await Promise.all(
      usersData.map(async (user) => {
        const hash = await bcrypt.hash(user.password, 10);
        return {
          ...user,
          password: hash
        };
      })
    );

    await User.insertMany(users);

    console.log("✅ Users seeded successfully");
    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUsers();