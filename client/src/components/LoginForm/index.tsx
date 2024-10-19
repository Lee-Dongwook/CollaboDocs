interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

export default function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl">Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        placeholder="Email"
        className="border p-2 mt-2 w-full"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        placeholder="Password"
        className="border p-2 mt-2 w-full"
      />
      <button onClick={onSubmit} className="bg-blue-500 text-white p-2 mt-4">
        Login
      </button>
    </div>
  );
}
