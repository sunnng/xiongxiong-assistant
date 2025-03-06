import auth from '@/features/auth/server/route'
import guild from '@/features/guild/server/route'

import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'nodejs'

const app = new Hono().basePath('/api')

const _route = app.route('/auth', auth).route('/guild', guild)

export const GET = handle(app)
export const POST = handle(app)

export type AppType = typeof _route
