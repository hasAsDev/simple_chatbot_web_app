function Message({ role, content }) {
  return (
    <>
      {role == "user" ? (
        <div className="flex justify-end">
          <div className="w-fit bg-[#EFF6FF] mx-10 px-5 py-5 rounded-lg">
            <p className="text-wrap" style={{ whiteSpace: "pre-line" }}>
              {content}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-start">
          <div className="w-fit bg-[#C7D9DD] mx-10 px-5 py-5 rounded-lg">
            <p className="text-wrap" style={{ whiteSpace: "pre-line" }}>
              {content == "<|pending|>" ? (
                <div className="flex gap-3">
                  <span class="inline-flex size-1 animate-ping rounded-full bg-black opacity-75"></span>
                  <span class="inline-flex size-1 animate-ping rounded-full bg-black opacity-75"></span>
                  <span class="inline-flex size-1 animate-ping rounded-full bg-black opacity-75"></span>
                </div>
              ) : (
                content
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Message;
