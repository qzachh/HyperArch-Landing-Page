import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, company, email, phone, preferred_solution, pain_points, note } = await req.json()

    // Format pain points for email
    const painPointsList = pain_points && pain_points.length > 0 
      ? pain_points.join(', ') 
      : 'None selected'

    // Create email content
    const emailContent = `
      <h2>New Contact Form Submission - HyperArch</h2>
      <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
      
      <h3>Contact Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Company/Organisation:</strong> ${company}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
      </ul>
      
      <h3>Preferences:</h3>
      <ul>
        <li><strong>Preferred Solution:</strong> ${preferred_solution}</li>
        <li><strong>Pain Points Selected:</strong> ${painPointsList}</li>
      </ul>
      
      ${note ? `<h3>Additional Notes:</h3><p>${note}</p>` : ''}
      
      <hr>
      <p><em>This email was automatically generated from the HyperArch landing page contact form.</em></p>
    `

    // Send email using a service like Resend, SendGrid, or similar
    // For this example, we'll use a simple fetch to a hypothetical email service
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'HyperArch <noreply@hyperarch.com>',
        to: ['cqizhi@u.nus.edu', 'joelleo@comp.nus.edu.sg'],
        subject: `New HyperArch Contact: ${name} from ${company}`,
        html: emailContent,
      }),
    })

    if (!emailResponse.ok) {
      throw new Error('Failed to send email')
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})