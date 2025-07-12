"use client"

import React, { useState, useEffect } from "react";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("infowecollect");

  const sections = [
    { id: "infowecollect", title: "Information We Collect" },
    { id: "howweuse", title: "How We Use Your Information" },
    { id: "shareinfo", title: "Sharing Information" },
    { id: "datasecurity", title: "Data Security" },
    { id: "yourchoices", title: "Your Choices" },
    { id: "changetoprivacypolicy", title: "Changes to this Privacy Policy" },
    { id: "contactus", title: "Contact Us" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <nav className="sticky top-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Navigation</h3>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                        activeSection === section.id
                          ? "bg-[#007f94] text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-100 hover:text-[#007f94]"
                      }`}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="prose prose-lg max-w-none">
              {/* Information We Collect */}
              <div id="infowecollect" className="mb-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Information We Collect</h3>
                
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-gray-700 mb-3">Personal Information</h4>
                  <p className="text-gray-600 leading-relaxed">
                    We may collect personal information that you provide directly to us, such as your name, email address, contact details, and other identifying information when you create an account or interact with our services.
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-gray-700 mb-3">Usage Information and Cookies</h4>
                  <p className="text-gray-600 leading-relaxed">
                    We automatically collect certain information when you access and use our website. This may include your usage patterns, and interactions with our website. To enhance your experience, we use cookies, which are small data files stored on your device. Cookies help us analyze website traffic, understand user behavior, and personalize your experience. You can control cookies through your browser settings and other tools. By using our website, you consent to the use of cookies as described in this Privacy Policy.
                  </p>
                </div>
              </div>

              {/* How We Use Your Information */}
              <div id="howweuse" className="mb-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">How We Use Your Information</h3>
                <p className="text-gray-600 mb-4">We may use the collected information for various purposes, including:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>Providing and improving our services and features.</li>
                  <li>Facilitating communication between parents, teachers, and school administrators.</li>
                  <li>Facilitating connectivity between parents and school administration.</li>
                  <li>Personalizing your experience and tailoring content to your preferences.</li>
                  <li>Analyzing usage patterns to optimize our functionality.</li>
                  <li>Complying with legal obligations.</li>
                  <li>Resolving disputes.</li>
                </ol>
              </div>

              {/* Sharing of Information */}
              <div id="shareinfo" className="mb-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Sharing of Information</h3>
                <p className="text-gray-600 mb-4">We may share your information under the following circumstances:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>With school administration to facilitate the connectivity between users and schools.</li>
                  <li>With third-party service providers who assist in operating our services.</li>
                  <li>In response to a legal request or as required by law.</li>
                </ol>
              </div>

              {/* Data Security */}
              <div id="datasecurity" className="mb-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Data Security</h3>
                <p className="text-gray-600 leading-relaxed">
                  We employ an array of security measures including but not limited to data encryption to keep the data we collect about our users safe and secure. We do not disclose your information to our employees, partners and or contractors, inclusive of third party agents that may seek to collect your personal data. In case of a breach, we have security measures in place to protect your personal data.
                </p>
              </div>

              {/* Your Choices */}
              <div id="yourchoices" className="mb-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Choices</h3>
                <p className="text-gray-600 leading-relaxed">
                  You have the right to access, correct, or delete your personal information. You may also opt-out of certain communications from us. However, please note that deleting certain information may affect your ability to use certain features of our services.
                </p>
              </div>

              {/* Changes to this Privacy Policy */}
              <div id="changetoprivacypolicy" className="mb-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Changes to this Privacy Policy</h3>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes via our services or other means. Your continued use of our services after such changes constitutes your acceptance of the revised Privacy Policy.
                </p>
              </div>

              {/* Contact Us */}
              <div id="contactus" className="mb-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h3>
                <p className="text-gray-600 leading-relaxed">
                  If you have any questions or concerns regarding this Privacy Policy, please contact us at{" "}
                  <a href="mailto:info@petiteelise.com" className="text-[#007f94] hover:text-[#005a6b] underline">
                    info@petiteelise.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 