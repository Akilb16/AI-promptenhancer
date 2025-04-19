import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import type { Database } from "@/lib/supabase/database.types"

type ContextWithCookies = GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse }

export const createClientForPages = (context: ContextWithCookies) => {
  return createServerComponentClient<Database>({ cookies: () => context.req.cookies })
}
