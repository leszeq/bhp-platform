export function inviteEmail(link: string) {
  return {
    subject: 'Szkolenie BHP – wymagane',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <h2 style="color: #111;">Szkolenie BHP</h2>
        <p>Zostałeś zapisany na wymagane szkolenie BHP przez swojego pracodawcę.</p>
        <div style="margin: 30px 0;">
          <a href="${link}" style="background-color: #111; color: #fff; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">
            Rozpocznij szkolenie
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">Zajmie ok. 30 minut.</p>
      </div>
    `,
  }
}

export function reminderEmail(link: string) {
  return {
    subject: 'Przypomnienie: Wymagane szkolenie BHP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <h2 style="color: #111;">Szkolenie BHP czeka na Ciebie</h2>
        <p>Przypominamy, że masz nieukończone, obowiązkowe szkolenie BHP ze statusem oczekującym.</p>
        <div style="margin: 30px 0;">
          <a href="${link}" style="background-color: #111; color: #fff; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">
            Rozpocznij teraz
          </a>
        </div>
      </div>
    `,
  }
}

export function inProgressEmail(link: string) {
  return {
    subject: 'Dokończ swoje szkolenie BHP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <h2 style="color: #111;">Dokończ szkolenie BHP</h2>
        <p>Rozpocząłeś już szkolenie, ale brakuje jeszcze tylko egzaminującej kropki nad i :)</p>
        <div style="margin: 30px 0;">
          <a href="${link}" style="background-color: #111; color: #fff; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">
            Kontynuuj od ostatniego miejsca
          </a>
        </div>
      </div>
    `,
  }
}

export function certificateEmail(link: string) {
  return {
    subject: '🎉 Twój Certyfikat BHP jest gotowy',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <h2 style="color: #111;">Gratulacje!</h2>
        <p>Pozytywnie ukończyłeś egzamin końcowy ze szkolenia BHP. Poniżej znajdziesz dowód ukończenia w pdf.</p>
        <div style="margin: 30px 0;">
          <a href="${link}" style="background-color: #16a34a; color: #fff; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">
            Pobierz Certyfikat (PDF)
          </a>
        </div>
      </div>
    `,
  }
}
