function New({ socket_obj, isPending, setIsPending }) {
  function handleNew(e) {
    e.preventDefault();

    const prompt_data = {
      action: "reset",
    };
    const prompt_data_encoded = JSON.stringify(prompt_data);

    socket_obj.send(prompt_data_encoded);
    setIsPending(true);
  }

  return (
    <div className="">
      <form onSubmit={handleNew}>
        {isPending == true ? (
          <button
            disabled
            type="submit"
            className="text-white text-xl h-10 w-30 rounded-sm bg-[#4D6BFE] hover:cursor-wait"
          >
            Wait
          </button>
        ) : (
          <button
            type="submit"
            className="bg-[#D6DEE8] text-white text-xl h-10 w-30 rounded-sm
          hover:bg-[#4D6BFE] hover:cursor-pointer hover:duration-300 hover:ease-out"
          >
            New chat
          </button>
        )}
      </form>
    </div>
  );
}

export default New;
