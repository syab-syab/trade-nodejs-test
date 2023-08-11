// supabaseに入れたデータベースからjson形式でデータを取ってくる
// curl以外の手段で
// ブラウザに対するgetリクエストでとってこなくても良い

// Initialize the JS client
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://ncddhgoemdbghyzcmvmg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZGRoZ29lbWRiZ2h5emNtdm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgwMDExODYsImV4cCI6MTk5MzU3NzE4Nn0.huab2sybTGI0QW79oeU2DAJDCA7aHpq6Laf-pUM1kfs')

// Make a request
const { data: todos, error } = await supabase.from('todos').select('*')

