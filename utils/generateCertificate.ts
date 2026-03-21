import { PDFDocument, StandardFonts } from 'pdf-lib'

export async function generateCertificate(name: string, verificationCode: string = '') {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([600, 400])

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  page.drawText('CERTYFIKAT BHP', {
    x: 180,
    y: 300,
    size: 28,
    font: fontBold,
  })

  page.drawText(`Ukonczyl: ${name}`, {
    x: 200,
    y: 240,
    size: 16,
    font,
  })

  page.drawText(`Data: ${new Date().toLocaleDateString()}`, {
    x: 200,
    y: 190,
    size: 12,
    font,
  })

  if (verificationCode) {
    page.drawText(`Kod weryfikacji: ${verificationCode}`, {
      x: 200,
      y: 160,
      size: 10,
      font,
    })
    
    // Add Verify URL
    page.drawText(`Waznosc certyfikatu mozesz sprawdzic pod adresem:`, {
      x: 200,
      y: 140,
      size: 10,
      font,
    })
    
    // Zastąp url w produkcji własną domeną
    page.drawText(`http://localhost:3000/verify/${verificationCode}`, {
      x: 200,
      y: 125,
      size: 10,
      font,
    })
  }

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}
