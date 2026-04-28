import { NextResponse } from 'next/server'
import { openai, isAiMockMode } from '@/lib/openai'
import { createClient } from '@/lib/supabase/server'

const prompt = `
Jesteś ekspertem BHP w Polsce.

Wygeneruj 5 pytań testowych wielokrotnego wyboru na nowo rozpoczęty kurs.

Zasady:
- 1 poprawna odpowiedź
- 3 błędne odpowiedzi
- język polski
- pełna zgodność z przepisami prawa pracy i BHP
- brak dwuznaczności
- pytania muszą dotyczyć podanego tematu

Zwróć format JSON z kluczem "questions" będącym tablicą obiektów o strukturze:
{
  "questions": [
    {
      "question": "treść zapytania",
      "correct_answer": "jedna poprawna odpowiedź",
      "wrong_answers": ["pierwsza zła", "druga zła", "trzecia zła"]
    }
  ]
}
`

export async function POST(req: Request) {
  const supabase = await createClient()

  // Check auth - you might want to add role check here later
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { course_id, topic } = await req.json()

  // MOCK MODE FOR TESTING
  if (isAiMockMode) {
    const mockQuestions = [
      {
        question: `Pytanie testowe o temacie: ${topic} - 1`,
        correct_answer: "To jest poprawna odpowiedź (MOCK)",
        wrong_answers: ["Zła 1", "Zła 2", "Zła 3"]
      },
      {
        question: `Pytanie testowe o temacie: ${topic} - 2`,
        correct_answer: "Prawidłowa opcja (MOCK)",
        wrong_answers: ["Błędna A", "Błędna B", "Błędna C"]
      }
    ]

    const inserts = mockQuestions.map(q => ({
      course_id: course_id as string,
      question_text: q.question,
      correct_answer: q.correct_answer,
      wrong_answers: q.wrong_answers,
      is_verified: false,
      created_by: 'mock_ai'
    }))

    await supabase.from('question_bank').insert(inserts)
    return NextResponse.json({ ok: true, count: inserts.length })
  }

  try {
    let completion
    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
      try {
        completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: 'You are a BHP expert. Always respond in valid JSON.' },
            { role: 'user', content: `Temat: ${topic}\n\n${prompt}` },
          ],
        })
        break // Sukces - wyjdź z pętli
      } catch (err: any) {
        attempts++
        if (err.status === 429 && attempts < maxAttempts) {
          console.warn(`[AI] Rate limit hit. Attempt ${attempts}/${maxAttempts}. Waiting 2s...`)
          await new Promise(resolve => setTimeout(resolve, 2000))
          continue
        }
        throw err
      }
    }

    if (!completion) {
      throw new Error('Przekroczono limit zapytań AI. Spróbuj ponownie za chwilę.')
    }

    const content = completion.choices[0].message.content!
    const parsed = JSON.parse(content)
    const questions = parsed.questions || parsed

    if (!Array.isArray(questions)) {
      throw new Error('Invalid AI output format')
    }

    // Save to database as unverified questions
    const inserts = questions.map((q: any) => ({
      course_id: course_id as string,
      question_text: q.question as string,
      correct_answer: q.correct_answer as string,
      wrong_answers: q.wrong_answers as any, // Cast to any to satisfy Json type
      is_verified: false,
      created_by: 'ai',
    }))

    const { error } = await supabase.from('question_bank').insert(inserts)
    if (error) {
       throw new Error(error.message)
    }

    return NextResponse.json({ ok: true, count: inserts.length })
  } catch (error: any) {
    console.error('AI Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
