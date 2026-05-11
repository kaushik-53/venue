const sendEmail = async (options) => {
  console.log('--------------------------------------------------')
  console.log('📧 EMAIL DEBUG LOG')
  console.log(`To:      ${options.email}`)
  console.log(`Subject: ${options.subject}`)
  console.log(`Message: ${options.message || 'Check HTML content'}`)
  if (options.html) {
    console.log('HTML Content detected (check raw logs if needed)')
  }
  console.log('--------------------------------------------------')

  // Return a mock info object to prevent errors in controllers
  return { messageId: 'debug-log-id-' + Date.now() }
}

module.exports = sendEmail
