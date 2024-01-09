const Redis = require('ioredis');

class OtpService {

  constructor(redisClient) {
    this.redisClient = redisClient || new Redis(); // Assuming a default connection if not provided
  }

  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(type, mobile) {
    if (!type || !mobile) {
      throw new Error('Type and mobile are required.');
    }
    const otp = this.generateOtp();
    const redisKey = `${type}:${mobile}`;
    await this.redisClient.setex(redisKey, 300, otp);
    return otp;
  }

  async verifyOtp(type, mobile, otp) {
    if (!type || !mobile || !otp) {
      throw new Error('Type, mobile, and OTP are required.');
    }
    const redisKey = `${type}:${mobile}`;
    const storedOtp = await this.redisClient.get(redisKey);
    if (storedOtp === otp) {
      return;
    } else {
      throw new Error('Invalid OTP.');
    }
  }
}

module.exports = OtpService;
