import { useState } from "react";
import { trpc } from "../utils/trpc";

function Login() {
  const userSignupMutate = trpc.user.login.useMutation({
    onSuccess: (data) => {
      let token = data.token;
      localStorage.setItem("token", token);
      window.location.href = "/";
    },
  });
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      Signup page email
      <input type="text" onChange={(e) => setemail(e.target.value)}></input>
      password
      <input type="text" onChange={(e) => setPassword(e.target.value)}></input>
      <button
        onClick={async () => {
          userSignupMutate.mutate({
            email,
            password,
          });
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Login;
