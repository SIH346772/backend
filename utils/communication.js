const axios = require("axios").default;

/**
 * Send OTP to mobile number
 *
 * @async
 * @function
 * @param {string} mobile - mobile number
 * @param {Number|string} otp - otp to send
 * @return {boolean} true if success, false if failed
 */
const sendOTP = async (mobile, otp) => {
  try {
    const request = await axios.get("https://www.fast2sms.com/dev/bulkV2?authorization=" + process.env.FAST2SMS_API_KEY + "&route=otp&variables_values=" + otp.toString() + "&flash=0&numbers=" + mobile);
    if (request.status == 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  sendOTP,
};
