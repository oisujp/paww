import { Database } from "~/types/database.types";

export type User = Database["public"]["Tables"]["users"]["Row"];
export type PassTemplate = Database["public"]["Tables"]["passTemplates"]["Row"];
export type Pass = Database["public"]["Tables"]["passes"]["Row"];
