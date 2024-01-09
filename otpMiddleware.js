class OtpService {

  constructor(redisClient) {
    this.redisClient = redisClient;
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
    await this.redisSetex(redisKey, 300, otp);
    return otp;
  }

  async verifyOtp(type, mobile, otp) {
    if (!type || !mobile || !otp) {
      throw new Error('Type, mobile, and OTP are required.');
    }
    const redisKey = `${type}:${mobile}`;
    const storedOtp = await this.redisGet(redisKey);
    if (storedOtp === otp) {
      return;
    } else {
      throw new Error('Invalid OTP.');
    }
  }

  async redisSetex(key, seconds, value) {
    return new Promise((resolve, reject) => {
      this.redisClient.setex(key, seconds, value, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async redisGet(key) {
    return new Promise((resolve, reject) => {
      this.redisClient.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }
}

module.exports = OtpService;
