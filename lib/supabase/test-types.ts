import { createServerClient } from '@supabase/ssr'
import { Database } from './database.types'

async function test() {
  const supabase = createServerClient<Database>(
    '', '', { cookies: { getAll: () => [], setAll: () => {} } }
  )

  // This should NOT be never
  const { data } = await supabase.from('courses').select('*')
  if (data) {
    console.log(data[0].title)
  }

  // This should NOT be never
  await supabase.from('courses').insert({ title: 'test' })
}
