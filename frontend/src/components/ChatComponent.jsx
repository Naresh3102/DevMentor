import React, { useRef, useState, useEffect } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const ChatComponent = ({ currentSection }) => {
  const messageRef = useRef();
  const [presentSection, setPresentSection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [displayMessage, setDisplayMessage] = useState("Hi there!");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPresentSection(currentSection);

    const prompt = messageRef.current.value;

    setLoading(true);

    let newMessageList = [
      ...messages,
      {
        role: "user",
        content: prompt,
      },
    ];

    try {
      const response = await fetch("http://localhost:3001/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessageList,
          currentSection: currentSection,
        }),
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      newMessageList.push({
        role: data.response.message.role,
        content: data.response.message.content,
      });

      setMessages(newMessageList);
      setDisplayMessage(data.response.message.content);
      messageRef.current.value = "";
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const extractCodeFromString = (message) => {
    if (message.includes("```")) {
      return message.split("```");
    }
    return null;
  };

  const isCodeBlock = (str) => {
    if (
      str.includes("=") ||
      str.includes(";") ||
      str.includes("[") ||
      str.includes("]") ||
      str.includes("{") ||
      str.includes("}") ||
      str.includes("#") ||
      str.includes("//")
    ) {
      return true;
    }
    return false;
  };

  // Function to save messages to the database
  const saveMessagesToDatabase = async (currentMessageSection) => {
    try {
      const response = await fetch("http://localhost:3001/api/chats/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentSection: currentMessageSection,
          messages: messages,
        }),
      });

      if (response.ok) {
        // Clear the messages list after saving to database
        setMessages([]);
      } else {
        console.error("Failed to save messages to the database");
      }
    } catch (error) {
      console.error("Error saving messages to the database:", error);
    }
  };

  // Clear messages when currentSection changes
  useEffect(() => {
    if (currentSection && messages.length > 0) {
      saveMessagesToDatabase(presentSection);
    }
  }, [currentSection]);

  return (
    <div>
      <div className="mt-6 overflow-y-auto max-h-[400px]">
        {messages.map((message, index) => (
          <div key={index} className="flex items-center gap-2 py-2">
            <div className="text-base font-bold">
              {message.role === "assistant" ? (
                <div className="font-bold w-20 text-base">Assistant:</div>
              ) : (
                <div className="text-base font-bold w-20">You:</div>
              )}
            </div>
            <div className="bg-gray-100 py-2 px-4 border border-gray-400 rounded-md overflow-x-auto text-base">
              {!extractCodeFromString(message.content) ? (
                <div>{message.content}</div>
              ) : (
                extractCodeFromString(message.content).map((block, i) =>
                  isCodeBlock(block) ? (
                    <SyntaxHighlighter style={a11yDark} language="html">
                      {block}
                    </SyntaxHighlighter>
                  ) : (
                    <div>{block}</div>
                  )
                )
              )}
            </div>
          </div>
        ))}
      </div>
      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <input
            className="px-4 py-2 text-gray-700 placeholder-gray-500 bg-white border border-gray-700 rounded-lg"
            required
            type="text"
            ref={messageRef}
            placeholder="Ask a question or say something nice."
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 mt-2 mb-4 text-gray-700 bg-gray-100 border border-gray-700 rounded-lg hover:scale-110 transition-all duration-200"
        >
          Send 🚀
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;
