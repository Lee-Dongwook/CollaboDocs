interface RegisterFormProps {
  email: string;
  password: string;
  username: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onSubmit: () => void;
}

export default function RegisterForm({
  email,
  password,
  username,
  onEmailChange,
  onPasswordChange,
  onUsernameChange,
  onSubmit,
}: RegisterFormProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        placeholder="Username"
        className="border p-2 mt-2 w-full"
      />
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
        Register
      </button>
    </div>
  );
}
