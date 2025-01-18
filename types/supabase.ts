import { Database } from "~/types/database.types";

export type UserProfile = Database["public"]["Tables"]["userProfiles"]["Row"];
export type PassTemplate = Database["public"]["Tables"]["passTemplates"]["Row"];
