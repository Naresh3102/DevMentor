import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";

const AdminDashboard = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/chats");
      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const openModal = (chat) => {
    setSelectedChat(chat);
  };

  const closeChatModal = () => {
    setSelectedChat(null);
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="container mx-auto w-[100%]">
      <div className="flex justify-between mx-auto w-[90%] my-2">
        <h1 className="text-black font-bold text-xl sm:text-2xl">
          Admin Dashboard
        </h1>
      </div>

      {/* Request List Container */}
      <div className="bg-white rounded-lg sm:h-[85vh] border border-black p-4 w-[95%] mx-auto flex-row mb-3">
        <div className="h-fit">
          <div>
            <h1 className="text-xl font-semibold text-black">Chat List</h1>
          </div>
          <div className="flex gap-2 my-4 mb-8 flex-wrap">
            <input
              className="border-gray-400 border rounded w-full max-w-md p-2 font-semibold"
              type="text"
              name="search"
              id="search"
              value={searchTerm}
              onChange={handleSearchInputChange}
              placeholder="Search by section..."
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 rounded h-max py-2">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-xl mr-3"
              />
              Search
            </button>
          </div>
        </div>
        <div className="flex-row h-[75%] overflow-y-auto">
          {chats
            .filter((chat) => {
              if (
                searchTerm &&
                !chat.currentSection
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase().trim())
              )
                return false;
              return true;
            })
            .map((chat) => (
              <div
                key={chat._id}
                className="bg-white px-4 py-2 mb-4 border-gray-300 border shadow-md rounded-lg"
              >
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="font-semibold flex">
                    Section : {chat.currentSection}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => openModal(chat)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded "
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal for viewing request details */}
      {selectedChat && (
        <Modal open={true} onClose={closeChatModal}>
          <div className="max-w-md">
            <h2 className="text-lg font-bold mb-4">Chat Messages</h2>
            <div className="overflow-y-auto max-h-60">
              {selectedChat.messages.map((message, index) => (
                <div key={index} className="flex mb-2">
                  <div className="bg-gray-100 rounded-lg p-2 mr-2">
                    <p className="text-sm text-gray-600">{message.role}</p>
                  </div>
                  <div>
                    <p className="text-gray-800">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
