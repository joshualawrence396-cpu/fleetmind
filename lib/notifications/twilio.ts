// Twilio service (mock implementation until API keys are added)
export async function sendSMS(to: string, message: string) {
  console.log([SMS] To: , Message: )
  return { success: true, sid: 'mock-sms-id' }
}

export async function sendWhatsApp(to: string, message: string) {
  console.log([WhatsApp] To: , Message: )
  return { success: true, sid: 'mock-wa-id' }
}

export async function sendDeliveryNotification(
  to: string,
  trackingNumber: string,
  status: string,
  eta?: Date
) {
  let message = ''
  
  switch (status) {
    case 'OUT_FOR_DELIVERY':
      message = Your package  is out for delivery! Track it here: http://localhost:3000/shipments/
      break
    case 'DELIVERED':
      message = Your package  has been delivered! Thank you for choosing FleetMind.
      break
    case 'DELAYED':
      message = Your package  is delayed. New ETA: 
      break
    default:
      message = Your package  status updated: 
  }
  
  await Promise.all([
    sendSMS(to, message),
    sendWhatsApp(to, message)
  ])
}
