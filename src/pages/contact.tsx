const Contact = () => {
  return (
    <div className="text-center p-10 max-w-4xl mx-auto bg-blue-50 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1">
      <h1 className="text-3xl font-bold text-blue-700 hover:text-blue-900 transition-colors">
        Contact SPIL Labs
      </h1>
      <p className="text-gray-700 leading-relaxed mt-4">
        We value your inquiries and feedback. Reach out to us through the
        following channels:
      </p>
      {[
        {
          title: "Research and Development Center - Sri Lanka",
          address: "No 04, Pagoda Road, Nugegoda, Sri Lanka",
          email: "info@spil.com.au",
          phone: "+94 114 066 723",
        },
        {
          title: "Headquarters - Australia",
          address:
            "Waterman Business Centre, Suite 220, 44 Lakeview Drive, Scoresby VIC 3179, Australia",
          email: "info@spil.com.au",
          phone: "+61 390 000 065",
          hotline: "+61 402 535 795",
        },
        {
          title: "Sales & Support Center - USA",
          address: "DeGorter Inc, 5623 Cannon Drive, Monroe, NC 28110",
          email: "sales@degorter.com",
          phone: "+1 800-334-9399 | +1 704-282-2055",
          hotline: "+1 929 920 4489",
        },
      ].map((contact, index) => (
        <div
          key={index}
          className="text-left bg-white p-6 mt-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 border-l-4 border-blue-600"
        >
          <h2 className="text-xl font-semibold text-blue-700">
            {contact.title}
          </h2>
          <p className="text-gray-700 mt-2">
            <strong>Address:</strong> {contact.address}
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong>{" "}
            <a
              href={`mailto:${contact.email}`}
              className="text-blue-600 hover:underline"
            >
              {contact.email}
            </a>
          </p>
          <p className="text-gray-700">
            <strong>Phone:</strong> {contact.phone}
          </p>
          {contact.hotline && (
            <p className="text-gray-700">
              <strong>Hotline:</strong> {contact.hotline}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Contact;
