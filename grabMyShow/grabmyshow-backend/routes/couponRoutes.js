const express = require("express");

const router = express.Router();

const User = require("../models/User");

const {
verifyToken
} = require("../middleware/authMiddleware");

router.post(
"/apply",
verifyToken,
async (req, res) => {

try {

const { code, totalAmount } = req.body;

const user =
await User.findById(req.user.id);

const coupon =
user.coupons.find(

c =>
c.code === code &&
c.used === false

);

if (!coupon) {

return res.status(400).json({

message:
"Invalid or already used coupon"

});

}

const finalAmount =
Math.max(
totalAmount - coupon.discount,
0
);

coupon.used = true;

await user.save();

res.json({

success: true,

discount: coupon.discount,

finalAmount

});

} catch (error) {

res.status(500).json({

message: error.message

});

}

});

module.exports = router;