import React, { useState } from "react";
import CourseData from "./CourseData";
import ChatComponent from "./ChatComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

const CourseSection = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const handleSectionClick = (index, title) => {
    setActiveSection(activeSection === index ? index : index);
    setSelectedSection(title);
  };

  return (
    <div className="flex">
      <div className="w-1/4  overflow-y-auto h-[100vh] scroll-m-0 no-scrollbar">
        <div>
          {CourseData.map((section, index) => (
            <div key={index}>
              {/* Section Title with Border */}
              <div
                className={`cursor-pointer border-b border-gray-300 flex justify-between items-center ${
                  activeSection === index ? "bg-gray-100" : ""
                }`}
                onClick={() => handleSectionClick(index, section.title)}
              >
                <div
                  className={`font-semibold p-3  ${
                    activeSection === index ? "text-blue-600" : ""
                  }`}
                >
                  {section.title}
                </div>
                {/* Down Arrow */}
                <div className="pr-2">
                  {activeSection === index ? (
                    <FontAwesomeIcon icon={faCaretUp} />
                  ) : (
                    <FontAwesomeIcon icon={faCaretDown} />
                  )}
                </div>
              </div>
              {/* Section Content */}
              {activeSection === index && (
                <div className="mt-2 pl-2">{section.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Right Side */}
      <div className="w-3/4 p-6 border-l-2">
        {/* Title of Currently Selected Accordion */}
        {selectedSection && (
          <h2 className="text-xl font-semibold mb-4">{selectedSection}</h2>
        )}
        {/* Video Player */}
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <h2 className="font-semibold">Video Player</h2>
          <div className="mt-4">Your video player component here...</div>
        </div>
        {/* Chat Component */}
        <ChatComponent currentSection={selectedSection} />
      </div>
    </div>
  );
};

export default CourseSection;
