import { supabase } from "./supabase"
import { seedDatabase } from "./seed-database"

export async function resetDatabase() {
  try {
    console.log("Resetting database...")

    // Delete all data from tables
    await supabase.from("stream_tags").delete().neq("stream_id", 0)
    await supabase.from("streams").delete().neq("id", 0)
    await supabase.from("subfilters").delete().neq("id", 0)
    await supabase.from("tags").delete().neq("id", 0)
    await supabase.from("genres").delete().neq("id", 0)

    // Re-seed the database
    await seedDatabase()

    console.log("Database reset completed")
    return { success: true }
  } catch (error) {
    console.error("Error resetting database:", error)
    return { success: false, error }
  }
}
