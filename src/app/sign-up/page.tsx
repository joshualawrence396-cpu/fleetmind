import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">FM</span>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">FleetMind</h2>
          <p className="mt-2 text-sm text-gray-600">Create your account</p>
        </div>
        <SignUp />
      </div>
    </div>
  )
}
