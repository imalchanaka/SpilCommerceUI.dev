import React from "react";

const AboutUs = () => {
  return (
    <div className="text-center p-10 max-w-4xl mx-auto bg-blue-50 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1">
      <h1 className="text-3xl font-bold text-blue-700 hover:text-blue-900 transition-colors">
        About SPIL Labs
      </h1>
      <p className="text-gray-700 leading-relaxed mt-4">
        SPIL Labs serves as the Research and Development Center for SPIL
        Software, headquartered in Melbourne, Australia. We specialize in
        delivering unique software solutions tailored for the flat glass
        industry worldwide. Established in 2014 in Sri Lanka, our dedicated team
        of approximately 50 professionals is committed to driving innovation and
        excellence in glass software solutions.
      </p>
      <h2 className="text-2xl font-semibold text-blue-700 mt-6">Our Mission</h2>
      <p className="text-gray-700 leading-relaxed mt-2">
        To revolutionize the flat glass industry by providing cutting-edge
        software solutions that enhance efficiency, precision, and overall
        operational excellence for our clients globally.
      </p>
      <h2 className="text-2xl font-semibold text-blue-700 mt-6">Our Team</h2>
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        {[
          {
            name: "Lakshman Kalupathirana",
            role: "CEO",
            img: "https://via.placeholder.com/150",
          },
          {
            name: "Chamika Lakshan Bandara",
            role: "Software Support Engineer",
            img: "https://via.placeholder.com/150",
          },
          {
            name: "Ravindra Bulathsinhalage",
            role: "Middle East & Africa Representative",
            img: "https://via.placeholder.com/150",
          },
          {
            name: "Imeyshan Madusanka",
            role: "Technical Lead",
            img: "https://via.placeholder.com/150",
          },
        ].map((member, index) => (
          <div
            key={index}
            className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 w-48"
          >
            <img
              src={member.img}
              alt={member.name}
              className="w-24 h-24 mx-auto rounded-full border-4 border-blue-600 shadow-sm hover:scale-105 transition-transform"
            />
            <p className="text-gray-800 font-semibold mt-3">{member.name}</p>
            <p className="text-gray-600 text-sm">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
