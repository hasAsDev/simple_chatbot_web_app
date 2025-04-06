function Prompt({ socket_obj, isPending, setIsPending }) {
  function handlePrompt(e) {
    e.preventDefault();

    prompt = e.target.user_prompt.value;
    const prompt_data = {
      action: "generate",
      user_prompt: prompt,
    };
    const prompt_data_encoded = JSON.stringify(prompt_data);

    socket_obj.send(prompt_data_encoded);
    setIsPending(true);
    e.target.user_prompt.value = "";
  }

  return (
    <div className="rounded-lg bg-[#F3F4F6] w-200 mb-5 py-6 text-[#4D6BFE]">
      <form
        onSubmit={handlePrompt}
        className="flex justify-center items-center gap-3 mx-5"
      >
        <textarea
          name="user_prompt"
          id="user_prompt"
          placeholder="Ask anything"
          rows={2}
          cols={70}
          wrap="soft"
          autoFocus
          required
          className="inline-block text-xl resize-none p-5 overscroll-contain outline-0"
        ></textarea>

        {isPending == true ? (
          <button
            disabled
            type="submit"
            className="rounded-full size-20 text-white bg-[#4D6BFE] hover:cursor-wait "
          >
            Wait
          </button>
        ) : (
          <button
            type="submit"
            className="rounded-full size-20 bg-[#D6DEE8] text-white
          hover:bg-[#4D6BFE] hover:cursor-pointer hover:duration-300 hover:ease-out "
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}

export default Prompt;
