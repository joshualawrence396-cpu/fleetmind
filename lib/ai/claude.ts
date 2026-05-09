import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface AIAgentContext {
  type: 'DISPATCHER' | 'CUSTOMER_SUPPORT' | 'RETURNS'
  data: any
}

export async function runDispatcherAgent(context: any) {
  // If no API key, use mock responses
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('ANTHROPIC_API_KEY not set, using mock response')
    return {
      action: 'RETRY',
      reason: 'Mock dispatcher decision',
      message_to_customer: 'Your delivery will be retried tomorrow.',
      urgency: 'MEDIUM'
    }
  }

  const prompt = You are a logistics dispatcher. Analyze this situation and suggest the best action.

Current situation:
- Stop ID: 
- Reason for failure: 
- Driver notes: 
- Attempt number: 

Available actions:
1. Reroute to next stop and retry tomorrow
2. Mark as delivered after photo verification
3. Return to sender
4. Contact customer for instructions

Respond with JSON containing:
- action (string)
- reason (string)
- message_to_customer (string)
- urgency (LOW/MEDIUM/HIGH)

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      temperature: 0.5,
      messages: [{ role: 'user', content: prompt }]
    })

    try {
      return JSON.parse(response.content[0].text)
    } catch {
      return {
        action: 'RETRY',
        reason: 'Agent response parsing failed',
        message_to_customer: 'Your delivery will be retried tomorrow.',
        urgency: 'MEDIUM'
      }
    }
  } catch (error) {
    console.error('Claude API error:', error)
    return {
      action: 'RETRY',
      reason: 'API error, using default',
      message_to_customer: 'We are experiencing issues. Your delivery will be updated soon.',
      urgency: 'MEDIUM'
    }
  }
}

export async function runCustomerSupportAgent(query: string, shipmentData: any) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Thank you for contacting FleetMind support. Your shipment  is currently . We'll keep you updated on its progress.
  }

  const prompt = You are a customer support agent for FleetMind logistics.
Customer query: ""

Shipment details:
- Tracking number: 
- Status: 
- Estimated delivery: 
- Last location: 

Respond with a friendly, helpful message that answers the customer's question.
Be concise and professional. Include the tracking number in your response.

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    })
    return response.content[0].text
  } catch (error) {
    console.error('Claude API error:', error)
    return Your shipment  is . For more details, please track your package at https://track.fleetmind.com/
  }
}

export async function runReturnsAgent(context: any) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      decision: 'ACCEPT_RETURN',
      refund_amount: 0,
      message: 'Your return has been approved. Please ship the item back to our warehouse.'
    }
  }

  const prompt = You are a returns manager. Decide what to do with a returned package.

Item: 
Reason: 
Customer history: 
Shipper policy: 

Options:
- Accept return and refund
- Offer replacement
- Partial refund
- Reject return with explanation

Respond with JSON containing decision, refund_amount (if applicable), and message to customer.

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 400,
      temperature: 0.5,
      messages: [{ role: 'user', content: prompt }]
    })

    try {
      return JSON.parse(response.content[0].text)
    } catch {
      return {
        decision: 'ACCEPT_RETURN',
        refund_amount: 0,
        message: 'Your return request has been approved.'
      }
    }
  } catch (error) {
    console.error('Claude API error:', error)
    return {
      decision: 'ACCEPT_RETURN',
      refund_amount: 0,
      message: 'Return approved. Please send the item back.'
    }
  }
}
