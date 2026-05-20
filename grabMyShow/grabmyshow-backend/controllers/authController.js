const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ✅ REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Register Request:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "user",
      coupons: [

{
code: "WELCOME100",
discount: 100
},

{
code: "MOVIE50",
discount: 50
},

{
code: "DINE20",
discount: 20
}

]
      
    });

    console.log("USER SAVED IN DB:", user);

    res.status(201).json({
      message: "User Registered Successfully",
      userId: user._id
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User find
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Password check
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("ROLE FROM MONGODB:", user.role);

    // Token banao
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🍪 STEP 4 ADD HERE
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // Response
    res.json({
      message: "Login Successful",
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};