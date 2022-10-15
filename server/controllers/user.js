const jwt = require('jsonwebtoken');

const UserModel = require('../db/models/user');
const ProfileModel = require('../db/models/profile');
const response = require('../helpers/response');

const encrypt = require('../helpers/encrypt');
const decrypt = require('../helpers/decrypt');

exports.preregister = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    // generate one-time password
    const otp = Math.floor(1000 + Math.random() * 9000);

    response({
      res,
      statusCode: 201,
      message: 'Pre-registration successful',
      payload: {
        otp, // -> send otp code to store in localStorage
        fullname,
        email,
        password: encrypt(password),
      },
    });
  }
  catch (error0) {
    response({
      res,
      statusCode: error0.statusCode || 500,
      success: false,
      message: error0.message,
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { _id: userId, pin } = await new UserModel(req.body).save();
    // save user _id and pin on profile model
    const profile = await new ProfileModel({
      userId,
      pin,
      ...req.body,
    }).save();

    response({
      res,
      statusCode: 201,
      message: 'Successfully created a new account',
      payload: profile,
    });
  }
  catch (error0) {
    response({
      res,
      statusCode: error0.statusCode || 500,
      success: false,
      message: error0.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const errData = {};
    const { pin, password } = req.body;

    const user = await UserModel.findOne({
      $or: [
        { email: pin }, // -> pin field can be filled with email
        { pin },
      ],
    });

    // if user not found or invalid password
    if (!user) {
      errData.statusCode = 401;
      errData.message = 'PIN or email not registered';

      throw errData;
    }

    // decrypt password
    decrypt(password, user.password);
    // generate access token
    const token = jwt.sign({ _id: user._id }, 'shhhhh');

    response({
      res,
      statusCode: 200,
      message: 'Successfully logged in',
      payload: token, // -> send token to store in localStorage
    });
  }
  catch (error0) {
    response({
      res,
      statusCode: error0.statusCode || 500,
      success: false,
      message: error0.message,
    });
  }
};