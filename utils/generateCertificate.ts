import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

function sanitizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l").replace(/Ł/g, "L")
    .replace(/ń/g, "n").replace(/Ń/g, "N")
    .replace(/ą/g, "a").replace(/Ą/g, "A")
    .replace(/ę/g, "e").replace(/Ę/g, "E")
    .replace(/ś/g, "s").replace(/Ś/g, "S")
    .replace(/ć/g, "c").replace(/Ć/g, "C")
    .replace(/ź/g, "z").replace(/Ź/g, "Z")
    .replace(/ż/g, "z").replace(/Ż/g, "Z")
    .replace(/ó/g, "o").replace(/Ó/g, "O")
}

export async function generateCertificate(name: string, verificationCode: string = '') {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([600, 400])

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const sanitizedName = sanitizeText(name)

  page.drawText('CERTYFIKAT BHP', {
    x: 150,
    y: 300,
    size: 28,
    font: fontBold,
  })

  page.drawText(sanitizeText(`Potwierdzenie dla: ${sanitizedName}`), {
    x: 150,
    y: 240,
    size: 18,
    font: fontBold,
  })

  page.drawText(
    sanitizeText(`Data: ${new Date().toLocaleDateString('pl-PL')}`),
    {
      x: 150,
      y: 200,
      size: 12,
      font: fontBold,
    }
  )

  page.drawText('Szkolenie BHP online (E-Learning)', {
    x: 150,
    y: 170,
    size: 12,
    font: fontBold,
  })

  if (verificationCode) {
    page.drawText(sanitizeText(`Kod weryfikacyjny: ${verificationCode}`), {
      x: 150,
      y: 130,
      size: 9,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5)
    })
    
    page.drawText(`Weryfikacja: http://localhost:3000/verify/${verificationCode}`, {
      x: 150,
      y: 115,
      size: 9,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5)
    })
  }

  return await pdfDoc.save()
}
