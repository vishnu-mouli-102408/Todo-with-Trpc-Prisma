import { trpc } from "../utils/trpc";
import Signup from "./Signup";

function IndexPage() {
  const userQuery = trpc.user.me.useQuery();
  const todoMutate = trpc.todo.todoCreate.useMutation();
  const todoQuery = trpc.todo.todoGet.useQuery();
  //   console.log(todoQuery.data);

  if (userQuery.isLoading) {
    return <div>Loading...</div>;
  }
  if (userQuery.isError) {
    return <Signup />;
  }

  return (
    <div>
      <p>Hi {userQuery.data?.email}</p>
      {todoQuery.data?.map((x) => (
        <div key={x.id}>
          {x.title} - {x.content}
        </div>
      ))}
      <button
        disabled={todoMutate.isLoading}
        onClick={() =>
          todoMutate.mutate({ title: "Frodo", content: "go to gym" })
        }
      >
        Create Todo
      </button>
    </div>
  );
}

export default IndexPage;
