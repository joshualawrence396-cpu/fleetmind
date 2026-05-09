export async function sendSMS(to: string, message: string) {
  console.log([SMS] To: , Message: )
  return { success: true }
}

export async function sendWhatsApp(to: string, message: string) {
  console.log([WhatsApp] To: , Message: )
  return { success: true }
}

export async function sendDeliveryNotification(to: string, trackingNumber: string, status: string) {
  const message = Your shipment  status: . Track at http://localhost:3000/shipments/
  await sendSMS(to, message)
  return { success: true }
}
