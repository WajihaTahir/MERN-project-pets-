import { useNavigate } from "react-router-dom";

function Error404() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p>Nothing here , shoo!</p>
      <button
        onClick={() =>
          navigate("/", { replace: true, state: { message: "hello" } })
        }
      >
        Go To Home Page
      </button>
    </div>
  );
}

export default Error404;
