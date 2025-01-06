// ./src/sanity/env.ts

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!

// Values you may additionally want to configure globally
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-07-11'



// SUPABASE
export const supabaseProjectUrl = process.env.NEXT_PUBLIC_SUBABSE_PROJECT_URL!
export const supabaseAPIKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY!

