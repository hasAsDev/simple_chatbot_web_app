import { useState, useRef, useEffect, useLayoutEffect } from "react";

import Box from "./components/Box";
import New from "./components/New";
import Prompt from "./components/Prompt";

/*
line  = History(user_message="What is 1+1=?", assistant_message="<|pending|>")
line.save()

History.objects.all()

History.objects.all().delete()
*/

function App() {
  const [socket_obj, setSocket_obj] = useState({});
  const [chat_history, setChat_history] = useState([]);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(
      "ws://" + window.location.host + "/ws/chatbot" // ws://127.0.0.1:8000/ws/chatbot
    );

    socket.onopen = () => {
      setSocket_obj(socket);
      console.log("WebSocket connection established.");
    };

    socket.onmessage = (event) => {
      const data_decoded = JSON.parse(event.data);
      const process_state = data_decoded.process_state;

      switch (process_state) {
        case "opening":
          handleOpening(data_decoded.chat_history.reverse());
          break;

        case "pending":
          handlePending(data_decoded.chat_history.reverse());
          break;

        case "completed":
          handleCompleted(data_decoded.chat_history.reverse());
          break;

        case "reset":
          handleReset();
          break;

        default:
          console.log("state error!");
          break;
      }
    };
  }, []);

  // process_state = opening when user open the chatbox
  function handleOpening(chat_history) {
    const last_assistant_message =
      chat_history.length != 0 ? chat_history[0][1] : null;
    if (last_assistant_message == "<|pending|>") {
      setIsPending(true);
    }

    setChat_history(chat_history);
  }

  // process_state = pending when user send a prompt and waiting for responding
  function handlePending(chat_history) {
    console.log("pending");
    setChat_history(chat_history);
  }

  // process_state = completed when user receive a response
  function handleCompleted(chat_history) {
    console.log("completed");
    setChat_history(chat_history);
    setIsPending(false);
  }

  // process_state = reset when user receive a reset response
  function handleReset() {
    console.log("reset");
    setChat_history([]);
    setIsPending(false);
  }

  return (
    <div className="">
      <div className="fixed block w-full text-center text-lg text-black border-b-1 border-indigo-500 bg-white py-2">
        Mr. WHY?
      </div>

      <div className="flex justify-center overflow-auto">
        <Box chat_history={chat_history} />
      </div>

      <div className="fixed block w-full text-center bottom-0 flex flex-col items-center">
        <New
          socket_obj={socket_obj}
          isPending={isPending}
          setIsPending={setIsPending}
        />
        <Prompt
          socket_obj={socket_obj}
          isPending={isPending}
          setIsPending={setIsPending}
        />
      </div>
    </div>
  );
}

export default App;
