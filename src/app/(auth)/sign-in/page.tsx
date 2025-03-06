import { getLoggedInUser } from '@/lib/appwrite'

import { redirect } from 'next/navigation'
import { SignInForm } from './components/sign-in-form'

export default async function SignInPage() {
  const user = await getLoggedInUser()
  if (user)
    redirect('/')

  return (
    <div className="">
      <SignInForm />
    </div>
  )
}
