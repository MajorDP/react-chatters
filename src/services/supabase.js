import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://qyucvqgjipbnhwrlbgby.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dWN2cWdqaXBibmh3cmxiZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1MDA3ODMsImV4cCI6MjAzMzA3Njc4M30.HdlZ0KvzKI2TcR27a5UOiOkDFsy2JcjcfCVgJoaMBeY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
