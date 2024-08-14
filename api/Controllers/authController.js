import JWT from "jsonwebtoken";
import userModel from "../Models/userModel.js";
import { comaprePassword, hashPassword } from "../helper/authHelper.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //validations
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    //check user
    const existingUser = await userModel.findOne({ email });
    // existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered Please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await userModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered",
      });
    }

    const passMatch = await comaprePassword(password, user.password);
    if (!passMatch) {
      return res.status(200).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate token
    const token = await JWT.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      {}
    );

    res.cookie("token", token).json({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

export const profileController = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (token) {
      const user = JWT.verify(token, process.env.JWT_SECRET);
      const { name, email, _id } = await userModel.findById(user.id);
      const userInfo = { name, email, _id };
      res.status(200).send({
        success: true,
        message: "User data fetched successfully",
        userInfo,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in profile",
      error: error.message,
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (token) {
      const { name, email, password } = req.body;

      // Verify token
      const user = JWT.verify(token, process.env.JWT_SECRET);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const updatedData = { name, email };

      // Hash the password if provided
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedData.password = hashedPassword;
      }

      // Find user and update
      const updatedUser = await userModel.findByIdAndUpdate(user.id, updatedData, {
        new: true, // Return the updated document
        runValidators: true, // Validate before updating
      });

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
          _id: updatedUser._id,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    console.error("Error updating profile:", error.message); // Log error for debugging
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};
export const logoutController = async (req, res) => {
  res.cookie("token", "").json(true);
};

