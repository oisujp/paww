import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const PAWW_BASE_URL = process.env.EXPO_PUBLIC_PAWW_BASE_URL!;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test Supabase Function
async function testSupabaseFunction() {
  try {
    const { data, error } = await supabase.functions.invoke("hello-world", {
      body: {
        name: "oisu",
      },
    });
    if (error) throw error;
    console.log("✅ Supabase Function Response:", data);
  } catch (error) {
    console.error("❌ Supabase Function Error:", error);
  }
}

// Test Supabase Database
async function testSupabaseDatabase() {
  try {
    const { data, error } = await supabase
      .from("passTemplates")
      .select("*")
      .limit(1);
    if (error) throw error;
    console.log("✅ Supabase Database Response:", data);
  } catch (error) {
    console.error("❌ Supabase Database Error:", error);
  }
}

// Test paww Backend
async function testPawwBackend() {
  try {
    const response = await axios.get(PAWW_BASE_URL + "/api/hello-world");
    console.log("✅ paww Backend Response:", response.data);
  } catch (error) {
    console.error("❌ paww Backend Error:", error);
  }
}

// Run tests
async function runTests() {
  console.log(
    "\n🔍 Running API Connection Tests...\n" + "Env: " + process.env.APP_VARIANT
  );
  await testSupabaseFunction();
  await testSupabaseDatabase();
  await testPawwBackend();
}

runTests();
