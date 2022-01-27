import { LockClosedIcon } from "@heroicons/react/solid";
import React from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/form/InputField";
import AppwriteService from "../../database/appwriteService";

export default function RegisterForm(props: {
  appwriteService: AppwriteService;
}) {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  let navigate = useNavigate();

  async function onSubmitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await props.appwriteService.createAccount(email, username, password);

      navigate("/home");
    } catch (error) {
      alert(`Error ${error}`);
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmitHandler}>
      <div>
        <div className="">
          <InputField
            type="text"
            value={username}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(event.target.value)
            }
            required
            placeholder="Username"
            className="rounded-t-md"
          />
          <InputField
            type="email"
            value={email}
            autoComplete="email"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(event.target.value)
            }
            required
            placeholder="Email address"
          />
          <InputField
            type="password"
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(event.target.value)
            }
            placeholder="Password"
            required
            className="rounded-b-md"
          />
        </div>
      </div>
      <button
        type="submit"
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
          <LockClosedIcon
            className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
            aria-hidden="true"
          />
        </span>
        Register
      </button>
    </form>
  );
}
