export async function sendPushNotification(
  userIds: string[],
  title: string,
  message: string,
  data?: any
) {
  console.log([Push] To: , Title: , Message: )
  return { success: true, id: 'mock-push-id' }
}

export async function sendDriverPushNotification(
  driverId: string,
  title: string,
  message: string,
  routeData?: any
) {
  return sendPushNotification([driverId], title, message, { type: 'ROUTE_UPDATE', data: routeData })
}

export async function sendCustomerPushNotification(
  customerId: string,
  shipmentId: string,
  status: string
) {
  const titles = {
    OUT_FOR_DELIVERY: 'Your package is out for delivery!',
    DELIVERED: 'Package delivered!',
    DELAYED: 'Delivery update'
  }
  
  const messages = {
    OUT_FOR_DELIVERY: 'Your driver is on the way with your package.',
    DELIVERED: 'Your package has been successfully delivered.',
    DELAYED: 'Your delivery has been rescheduled.'
  }
  
  return sendPushNotification(
    [customerId],
    titles[status] || 'Shipment Update',
    messages[status] || Your shipment status has been updated to ,
    { shipmentId, status }
  )
}
