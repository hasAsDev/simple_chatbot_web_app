import Message from "./Message";

function Box({ chat_history }) {
  return (
    <div className="pt-15 pb-60 w-3xl max-w-3xl flex flex-col gap-5">
      {chat_history.map((turn, idx) => (
        <>
          <Message key={idx * 2 + 1} role={"assistant"} content={turn[1]} />
          <Message key={idx * 2} role={"user"} content={turn[0]} />
        </>
      ))}
    </div>
  );
}

export default Box;
