const Chat = require("../model/chatModel");
const OpenAI = require("openai");
const CourseData = require("../CourseData");

const getMessages = async (req, res) => {
  try {
    const { messages, currentSection } = req.body;

    const currentIndex = CourseData.findIndex(
      (section) => section.title === currentSection
    );

    const completedSectionsList = CourseData.slice(0, currentIndex + 1).map(
      (section) => section.title
    );

    const completedSectionMessage =
      completedSectionsList.length > 0
        ? `Completed Sections: ${completedSectionsList.join(", ")}`
        : "No sections completed yet";

    const sections = CourseData.map(
      (section) => `${section.title}: ${section.content}`
    );

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: `you are a programming assistant made for DevMastery website. If the user's question is not directly related to programming then reject it. Always suggest the user about the section that is related to the question. You are not allowed to answer question that are not related to the course sections`,
        },
        {
          role: "system",
          content: `Course Sections: ${sections}`,
        },
        {
          role: "system",
          content: completedSectionMessage,
        },
        {
          role: "system",
          content:
            "Answer the user questions on the section. You are not allowed answer questions related to sections the user is not yet completed. If the section is not completed tell the user to refer the section",
        },
        ...messages,
      ],
    });

    res.json({ response: response.choices[0] });
  } catch (error) {
    console.error("Error processing request:", error);
    res
      .status(500)
      .json({ error: "An error occured while processing your request" });
  }
};

const createChats = async (req, res) => {
  try {
    const { messages, currentSection } = req.body;

    const chat = new Chat({
      messages: messages,
      currentSection: currentSection,
    });

    await chat.save();

    res.status(201).json({ message: "Message saved successfullt" });
  } catch (error) {
    console.error("Error saving messages:", error);
    res.status(500).json({ error: "An error occured while saving messages" });
  }
};

const getChats = async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "An error occurred while fetching chats" });
  }
};

const getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the chat" });
  }
};

module.exports = { getMessages, createChats, getChats, getChat };
