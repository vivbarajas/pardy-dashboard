'use server'
import { cookies } from 'next/headers'
import { signin, signup } from '@/utils/authTools'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { COOKIE_NAME } from '@/utils/constants'

const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// The first argument is going to be the previous state
// of the form that this action is bound to.
// Form Data type is a map of all the input fields by the name you gave them in the form
//
//

export const registerUser = async (prevState: any, formData: FormData) => {
  // validate this schema
  // have to call the get method on maps
  const data = authSchema.parse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  // wrap the signup part in a try catch so we can show a message on the form is signup fails
  try {
    const { token } = await signup(data)
    // if succeeds we are using json web tokens for authentication and we are setting them in the cookies
    // reason for the cookie, we want to be able  to access json web tokens
    // on all server side calls and functions that have access to the cookies
    // if we store the token in local storage we couldnt access local storage from the server, its possible just a lot of work

    cookies().set(COOKIE_NAME, token)
  } catch (e) {
    console.error(e)
    return { message: 'Failed to sign you up' }
  }

  // dont put a redirect in a try catch
  // if you put it in a try catch it catches an error
  redirect('/dashboard')
}

export const signinUser = async (prevstate: any, formData: FormData) => {
  const data = authSchema.parse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  try {
    const { token } = await signin(data)
    cookies().set(COOKIE_NAME, token)
  } catch (e) {
    console.error(e)
    return { message: 'Failed to sign you in' }
  }

  redirect('/dashboard')
}
