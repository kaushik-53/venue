const sendEmail = async (options) => {
  const otpMatch = options.message?.match(/\b\d{6}\b/) || options.html?.match(/\b\d{6}\b/)
  const otp = otpMatch ? otpMatch[0] : null

  console.log('\n' + '='.repeat(50))
  console.log('📧 EMAIL DEBUG LOG')
  console.log(`To:      ${options.email}`)
  console.log(`Subject: ${options.subject}`)
  
  if (otp) {
    console.log('\n✨ FOUND OTP CODE: ' + otp + ' ✨\n')
  }

  console.log(`Message: ${options.message || 'Check HTML content'}`)
  console.log('='.repeat(50) + '\n')

  return { messageId: 'debug-log-id-' + Date.now() }
}

module.exports = sendEmail
