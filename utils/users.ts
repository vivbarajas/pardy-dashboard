import 'server-only'
import { COOKIE_NAME } from './constants'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserFromToken } from './authTools'
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const token = cookies().get(COOKIE_NAME)
  //   no return here because redirect returns a type never as in nothing could happen after this is called it will terminate here if this actually happens
  if (!token) redirect('/signin')

  const user = await getUserFromToken(token)
  if (!user) redirect('/signin')

  return user
})
