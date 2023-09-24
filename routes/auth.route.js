const router = require("express").Router();
const prisma = require("../db").getInstance();
const { sendOTP } = require("../utils/communication");

const JWT = require("../utils/jwt");

// POST /auth/otp
router.post("/otp", async (req, res) => {
  let { phone } = req.body;
  if (!phone) {
    return res.status(400).json({
      error: "Phone number is required",
    });
  }
  phone = phone.toString().trim();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.$transaction(async (tx) => {
    const record = await prisma.otp.create({
      data: {
        phone,
        otp,
        createdAt: new Date(),
      },
    });
    const isSent = await sendOTP(phone, otp);
    if (!isSent) {
      return res.status(500).json({
        message: "OTP sending failed",
        data: {},
      });
    } else {
      return res.status(200).json({
        message: "OTP sent successfully",
        id: record.id,
      });
    }
  });
});

// POST /auth/login
router.post("/login", async (req, res) => {
  let { phone, otp, otpId,fcmtoken } = req.body;
  if (!phone || !otp || !otpId) {
    return res.status(400).json({
      error: "Phone number, OTP and OTP ID is required",
    });
  }
  phone = phone.toString().trim();
  otp = otp.toString().trim();
  otpId = otpId.toString().trim();
  const record = await prisma.otp.findUnique({
    where: {
      id: otpId,
    },
  });
  if (!record) {
    return res.status(400).json({
      error: "Invalid OTP ID",
    });
  }
  if (record.phone != phone || record.otp != otp) {
    return res.status(400).json({
      error: "Invalid OTP",
    });
  }
  const user = await prisma.user.findUnique({
    where: {
      phone,
    },
  });
  if (!user) {
    return res.status(400).json({
      error: "User not found",
    });
  }
  // Delete OTP record
  await prisma.otp.delete({
    where: {
      id: otpId,
    },
  });

  //pushing fcmtoken

  user.fcmTokens.push(fcmToken);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      fcmTokens: user.fcmTokens,
    },
  });

  // Generate JWT token
  const token = JWT.generate({
    id: user.id,
    phone: user.phone,
    name: user.name,
  });



  return res.status(200).json({
    message: "Login successful",
    token,
    user,
  });
});

// POST /auth/register
router.post("/register", async (req, res) => {
  let { phone, otp, otpId, name, address,fcmToken } = req.body;
  if (!phone || !otp || !otpId || !name || !address) {
    return res.status(400).json({
      error: "Phone number, OTP, OTP ID, name and address is required",
    });
  }
  phone = phone.toString().trim();
  otp = otp.toString().trim();
  otpId = otpId.toString().trim();
  name = name.toString().trim();
  address = address.toString().trim();
  fcmToken = fcmToken.toString().trim();
  const record = await prisma.otp.findUnique({
    where: {
      id: otpId,
    },
  });
  if (!record) {
    return res.status(400).json({
      error: "Invalid OTP ID",
    });
  }
  if (record.phone != phone || record.otp != otp) {
    return res.status(400).json({
      error: "Invalid OTP",
    });
  }
  // Delete OTP record
  await prisma.otp.delete({
    where: {
      id: otpId,
    },
  });
  const user = await prisma.user.findUnique({
    where: {
      phone,
    },
  });
  if (user) {
    return res.status(400).json({
      error: "User already exists",
    });
  }
  let fcmTokens = [fcmToken];
  const newUser = await prisma.user.create({
    data: {
      phone,
      name,
      address,
      fcmTokens
    },
  });
  const token = JWT.generate({
    id: newUser.id,
    phone: newUser.phone,
    name: newUser.name,
  });
  return res.status(200).json({
    message: "Registration successful",
    token,
    user: newUser,
  });
});

module.exports = router;
