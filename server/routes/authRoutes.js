const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Patient = require("../models/Patient");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "mindset-ner-development-secret";
const generatePatientCode = () => {
  return `PAT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};
// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, patientId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required",
      });
    }
    if (!["patient", "caregiver", "healthcare_worker"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid registration role" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      patientId: patientId || null,
      patientCode: role === "patient" ? generatePatientCode() : null,
    });

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        patientId: user.patientId,
        patientCode:
          role === "patient" && patientId
            ? (await Patient.findById(patientId)).patientCode
            : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        patientId: user.patientId,
        patientCode: user.patientId
          ? (await Patient.findById(user.patientId))?.patientCode || null
          : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});

// Link the logged-in caregiver to a patient
router.put("/link-patient", protect, async (req, res) => {
  try {
    // Only admins can assign patients to caregivers.
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can link patients to caregivers",
      });
    }

    const { caregiverId, patientId } = req.body;

    if (!caregiverId || !patientId) {
      return res.status(400).json({
        success: false,
        message: "caregiverId and patientId are required",
      });
    }

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const caregiver = await User.findOne({
      _id: caregiverId,
      role: "caregiver",
    });

    if (!caregiver) {
      return res.status(404).json({
        success: false,
        message: "Caregiver not found",
      });
    }

    caregiver.patientId = patientId;
    await caregiver.save();

    const updatedUser = await User.findById(caregiver._id).select("-password");

    res.json({
      success: true,
      message: "Patient linked to caregiver successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to link patient",
      error: error.message,
    });
  }
});

// Get all caregivers for admin management
router.get("/caregivers", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can view caregivers",
      });
    }

    const caregivers = await User.find({
      role: "caregiver",
    })
      .select("-password")
      .sort({ name: 1 });

    res.json({
      success: true,
      caregivers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch caregivers",
      error: error.message,
    });
  }
});

module.exports = router;
