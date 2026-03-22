import { resend } from '@/lib/email'

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const data = await resend.emails.send({
      from: 'BHP <noreply@twojadomena.pl>',
      to,
      subject,
      html,
    })
    console.log(`[EMAIL WYSŁANY] Do: ${to} | Temat: "${subject}" | Data:`, data)
    return { success: true, data }
  } catch (err: any) {
    console.error(`[BLĄD EMAIL] Wysłanie do ${to} nie powiodło się:`, err.message)
    return { success: false, error: err.message }
  }
}
