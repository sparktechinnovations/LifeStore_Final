const speakeasy = require('speakeasy')

const verifyOtp = (secret, otp) => {
  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: otp,
    window: 20,
  })

  const timeDifference = speakeasy.totp.verifyDelta({
    secret,
    encoding: 'base32',
    token: otp,
    window: 20,
  })
  console.log(timeDifference)
  return { verified, valid: timeDifference !== undefined }
}

module.exports = { verifyOtp }
