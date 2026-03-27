


export default function RegisterPage() {
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <input placeholder="Email" type="email" className="border p-2 w-full mb-2" />
      <input placeholder="Password" type="password" className="border p-2 w-full mb-2" />
      <button className="bg-black text-white p-2 w-full">Register</button>
    </div>
  )
}