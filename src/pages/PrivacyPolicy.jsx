import React from 'react';

const PrivacyPolicy = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="prose prose-lg max-w-none">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PRIVACY POLICY</h1>
          <p className="text-gray-600 text-lg">Last updated October 02, 2025</p>
        </div>

        {/* Introduction */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed mb-4">
            This Privacy Notice for <strong>Youguide</strong> ("<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>"), 
            describes how and why we might access, collect, store, use, and/or share ("<strong>process</strong>") your personal 
            information when you use our services ("<strong>Services</strong>"), including when you:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Download and use our mobile application (Youguide Earth), or any other application of ours that links to this Privacy Notice</li>
            <li>Use Travel Guides & Esims. Users can purchase travel guides pdf and esims.</li>
            <li>Engage with us in other related ways, including any sales, marketing, or events</li>
          </ul>
          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400">
            <p className="text-gray-700">
              <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. 
              We are responsible for making decisions about how your personal information is processed. If you do not agree with our 
              policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at{' '}
              <a href="mailto:support@youguide.com" className="text-blue-600 hover:underline">support@youguide.com</a>.
            </p>
          </div>
        </div>

        {/* Summary of Key Points */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">SUMMARY OF KEY POINTS</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600 mb-4 italic">
              This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by using our table of contents below to find the section you are looking for.
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">What personal information do we process?</h3>
                <p className="text-gray-700">When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800">Do we process any sensitive personal information?</h3>
                <p className="text-gray-700">We do not process sensitive personal information.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800">Do we collect any information from third parties?</h3>
                <p className="text-gray-700">We do not collect any information from third parties.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800">How do we process your information?</h3>
                <p className="text-gray-700">We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800">In what situations and with which parties do we share personal information?</h3>
                <p className="text-gray-700">We may share information in specific situations and with specific third parties.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800">How do we keep your information safe?</h3>
                <p className="text-gray-700">We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet can be guaranteed to be 100% secure.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800">What are your rights?</h3>
                <p className="text-gray-700">Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800">How do you exercise your rights?</h3>
                <p className="text-gray-700">The easiest way to exercise your rights is by submitting a data subject access request, or by contacting us.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">TABLE OF CONTENTS</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <ol className="list-decimal list-inside space-y-1 text-blue-600">
              <li><button onClick={() => scrollToSection('info-collect')} className="hover:underline text-left">WHAT INFORMATION DO WE COLLECT?</button></li>
              <li><button onClick={() => scrollToSection('info-use')} className="hover:underline text-left">HOW DO WE PROCESS YOUR INFORMATION?</button></li>
              <li><button onClick={() => scrollToSection('legal-bases')} className="hover:underline text-left">WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?</button></li>
              <li><button onClick={() => scrollToSection('who-share')} className="hover:underline text-left">WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</button></li>
              <li><button onClick={() => scrollToSection('cookies')} className="hover:underline text-left">DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</button></li>
              <li><button onClick={() => scrollToSection('info-retain')} className="hover:underline text-left">HOW LONG DO WE KEEP YOUR INFORMATION?</button></li>
              <li><button onClick={() => scrollToSection('info-safe')} className="hover:underline text-left">HOW DO WE KEEP YOUR INFORMATION SAFE?</button></li>
              <li><button onClick={() => scrollToSection('info-minors')} className="hover:underline text-left">DO WE COLLECT INFORMATION FROM MINORS?</button></li>
              <li><button onClick={() => scrollToSection('privacy-rights')} className="hover:underline text-left">WHAT ARE YOUR PRIVACY RIGHTS?</button></li>
              <li><button onClick={() => scrollToSection('dnt')} className="hover:underline text-left">CONTROLS FOR DO-NOT-TRACK FEATURES</button></li>
              <li><button onClick={() => scrollToSection('us-laws')} className="hover:underline text-left">DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</button></li>
              <li><button onClick={() => scrollToSection('other-laws')} className="hover:underline text-left">DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?</button></li>
              <li><button onClick={() => scrollToSection('policy-updates')} className="hover:underline text-left">DO WE MAKE UPDATES TO THIS NOTICE?</button></li>
              <li><button onClick={() => scrollToSection('contact')} className="hover:underline text-left">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</button></li>
              <li><button onClick={() => scrollToSection('request')} className="hover:underline text-left">HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</button></li>
            </ol>
          </div>
        </section>

        {/* Section 1: What Information Do We Collect */}
        <section id="info-collect" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. WHAT INFORMATION DO WE COLLECT?</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal information you disclose to us</h3>
          <p className="text-gray-700 mb-4">
            <strong><em>In Short:</em></strong> <em>We collect personal information that you provide to us.</em>
          </p>
          
          <p className="text-gray-700 mb-4">
            We collect personal information that you voluntarily provide to us when you register on the Services, 
            express an interest in obtaining information about us or our products and Services, when you participate 
            in activities on the Services, or otherwise when you contact us.
          </p>
          
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Personal Information Provided by You</h4>
            <p className="text-gray-700 mb-2">The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>names</li>
              <li>phone numbers</li>
              <li>email addresses</li>
              <li>usernames</li>
              <li>passwords</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Sensitive Information</h4>
            <p className="text-gray-700">We do not process sensitive information.</p>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Payment Data</h4>
            <p className="text-gray-700 mb-2">
              We may collect data necessary to process your payment if you choose to make purchases, such as your payment instrument number, 
              and the security code associated with your payment instrument. All payment data is handled and stored by Apple Pay and Mollie.
            </p>
            <p className="text-gray-700">
              You may find their privacy notice links here:{' '}
              <a href="https://www.apple.com/legal/applepayments/privacy-notice" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                https://www.apple.com/legal/applepayments/privacy-notice
              </a>{' '}
              and{' '}
              <a href="https://www.mollie.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                https://www.mollie.com/privacy
              </a>.
            </p>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Application Data</h4>
            <p className="text-gray-700 mb-2">If you use our application(s), we also may collect the following information if you choose to provide us with access or permission:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li><em>Geolocation Information.</em> We may request access or permission to track location-based information from your mobile device, either continuously or while you are using our mobile application(s), to provide certain location-based services. If you wish to change our access or permissions, you may do so in your device's settings.</li>
            </ul>
            <p className="text-gray-700 mt-2">This information is primarily needed to maintain the security and operation of our application(s), for troubleshooting, and for our internal analytics and reporting purposes.</p>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Information automatically collected</h3>
          <p className="text-gray-700 mb-4">
            <strong><em>In Short:</em></strong> <em>Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.</em>
          </p>
          
          <p className="text-gray-700 mb-4">
            We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity 
            (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, 
            operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, 
            and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.
          </p>
          
          <p className="text-gray-700 mb-4">Like many businesses, we also collect information through cookies and similar technologies.</p>
          
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">The information we collect includes:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li><em>Location Data.</em> We collect location data such as information about your device's location, which can be either precise or imprecise. How much information we collect depends on the type and settings of the device you use to access the Services. For example, we may use GPS and other technologies to collect geolocation data that tells us your current location (based on your IP address). You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Location setting on your device. However, if you choose to opt out, you may not be able to use certain aspects of the Services.</li>
            </ul>
          </div>
          
          <p className="text-gray-700">All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</p>
        </section>

        {/* Section 2: How Do We Process Your Information */}
        <section id="info-use" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
          <p className="text-gray-700 mb-4">
            <strong><em>In Short:</em></strong> <em>We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We process the personal information for the following purposes listed below. We may also process your information for other purposes only with your prior explicit consent.</em>
          </p>
          
          <p className="text-gray-700 mb-4"><strong>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</strong></p>
          
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>To facilitate account creation and authentication and otherwise manage user accounts.</strong> We may process your information so you can create and log in to your account, as well as keep your account in working order.</li>
            <li><strong>To save or protect an individual's vital interest.</strong> We may process your information when necessary to save or protect an individual's vital interest, such as to prevent harm.</li>
          </ul>
        </section>

        {/* Section 3: Legal Bases */}
        <section id="legal-bases" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?</h2>
          <p className="text-gray-700 mb-4">
            <strong><em>In Short:</em></strong> <em>We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.</em>
          </p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">If you are located in the EU or UK, this section applies to you.</h3>
            <p className="text-gray-700 mb-4">
              The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Consent.</strong> We may process your information if you have given us permission (i.e., consent) to use your personal information for a specific purpose. You can withdraw your consent at any time.</li>
              <li><strong>Legal Obligations.</strong> We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.</li>
              <li><strong>Vital Interests.</strong> We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">If you are located in Canada, this section applies to you.</h3>
            <p className="text-gray-700 mb-4">
              We may process your information if you have given us specific permission (i.e., express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e., implied consent). You can withdraw your consent at any time.
            </p>
            <p className="text-gray-700 mb-4">In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way</li>
              <li>For investigations and fraud detection and prevention</li>
              <li>For business transactions provided certain conditions are met</li>
              <li>If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim</li>
              <li>For identifying injured, ill, or deceased persons and communicating with next of kin</li>
              <li>If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse</li>
              <li>If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province</li>
              <li>If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records</li>
              <li>If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced</li>
              <li>If the collection is solely for journalistic, artistic, or literary purposes</li>
              <li>If the information is publicly available and is specified by the regulations</li>
              <li>We may disclose de-identified information for approved research or statistics projects, subject to ethics oversight and confidentiality commitments</li>
            </ul>
          </div>
        </section>

        {/* Section 4: When and With Whom Do We Share */}
        <section id="who-share" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
          <p className="text-gray-700 mb-4">
            <strong><em>In Short:</em></strong> <em>We may share information in specific situations described in this section and/or with the following third parties.</em>
          </p>
          
          <p className="text-gray-700 mb-4">We may need to share your personal information in the following situations:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            <li><strong>When we use Google Maps Platform APIs.</strong> We may share your information with certain Google Maps Platform APIs (e.g., Google Maps API, Places API). Google Maps uses GPS, Wi-Fi, and cell towers to estimate your location. GPS is accurate to about 20 meters, while Wi-Fi and cell towers help improve accuracy when GPS signals are weak, like indoors. This data helps Google Maps provide directions, but it is not always perfectly precise.</li>
          </ul>
        </section>

        {/* Section 5: Cookies and Tracking */}
        <section id="cookies" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
          <p className="text-gray-700 mb-4">
            <strong><em>In Short:</em></strong> <em>We may use cookies and other tracking technologies to collect and store your information.</em>
          </p>
          
          <p className="text-gray-700 mb-4">
            We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.
          </p>
          
          <p className="text-gray-700 mb-4">
            We also permit third parties and service providers to use online tracking technologies on our Services for analytics and advertising, including to help manage and display advertisements, to tailor advertisements to your interests, or to send abandoned shopping cart reminders (depending on your communication preferences). The third parties and service providers use their technology to provide advertising about products and services tailored to your interests which may appear either on our Services or on other websites.
          </p>
          
          <p className="text-gray-700 mb-4">
            To the extent these online tracking technologies are deemed to be a "sale"/"sharing" (which includes targeted advertising, as defined under the applicable laws) under applicable US state laws, you can opt out of these online tracking technologies by submitting a request as described below under section "DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?"
          </p>
          
          <p className="text-gray-700">
            Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
          </p>
        </section>

        {/* Section 6: Information Retention */}
        <section id="info-retain" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
          <p className="text-gray-700 mb-4">
            <strong><em>In Short:</em></strong> <em>We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.</em>
          </p>
          
          <p className="text-gray-700 mb-4">
            We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.
          </p>
          
          <p className="text-gray-700">
            When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
          </p>
        </section>

        {/* Section 7: Information Safety */}
        <section id="info-safe" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
          <p className="text-gray-700 mb-4">
            <strong><em>In Short:</em></strong> <em>We aim to protect your personal information through a system of organizational and technical security measures.</em>
          </p>
          
          <p className="text-gray-700">
            We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.
          </p>
        </section>

        {/* Section 8: Minors */}
        <section id="info-minors" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. DO WE COLLECT INFORMATION FROM MINORS?</h2>
          <p className="text-gray-700 mb-4">
            <strong><em>In Short:</em></strong> <em>We do not knowingly collect data from or market to children under 18 years of age or the equivalent age as specified by law in your jurisdiction.</em>
          </p>
          
          <p className="text-gray-700 mb-4">
            We do not knowingly collect, solicit data from, or market to children under 18 years of age or the equivalent age as specified by law in your jurisdiction, 
            nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or the equivalent age as specified by law in your jurisdiction 
            or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services.
          </p>
          
          <p className="text-gray-700">
            If we learn that personal information from users less than 18 years of age or the equivalent age as specified by law in your jurisdiction has been collected, 
            we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected 
            from children under age 18 or the equivalent age as specified by law in your jurisdiction, please contact us at{' '}
            <a href="mailto:support@youguide.com" className="text-blue-600 hover:underline">support@youguide.com</a>.
          </p>
        </section>

        {/* Section 9: Privacy Rights */}
        <section id="privacy-rights" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
          <p className="text-gray-700 mb-4">
            <strong><em>In Short:</em></strong> <em>Depending on your state of residence in the US or in some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.</em>
          </p>
          
          <p className="text-gray-700 mb-4">
            In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making. If a decision that produces legal or similarly significant effects is made solely by automated means, we will inform you, explain the main factors, and offer a simple way to request human review. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below.
          </p>
          
          <p className="text-gray-700 mb-4">We will consider and act upon any request in accordance with applicable data protection laws.</p>
          
          <p className="text-gray-700 mb-4">
            If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your{' '}
            <a href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Member State data protection authority</a> or{' '}
            <a href="https://ico.org.uk/make-a-complaint/data-protection-complaints/data-protection-complaints/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">UK data protection authority</a>.
          </p>
          
          <p className="text-gray-700 mb-4">
            If you are located in Switzerland, you may contact the{' '}
            <a href="https://www.edoeb.admin.ch/edoeb/en/home.html" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Federal Data Protection and Information Commissioner</a>.
          </p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Withdrawing your consent:</h3>
            <p className="text-gray-700 mb-4">
              If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below.
            </p>
            <p className="text-gray-700 mb-4">
              However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Information</h3>
            <p className="text-gray-700 mb-2">If you would at any time like to review or change the information in your account or terminate your account, you can:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Log in to your account settings and update your user account.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.
            </p>
          </div>
          
          <p className="text-gray-700">
            If you have questions or comments about your privacy rights, you may email us at{' '}
            <a href="mailto:support@youguide.com" className="text-blue-600 hover:underline">support@youguide.com</a>.
          </p>
        </section>

        {/* Section 10: Do Not Track */}
        <section id="dnt" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
          <p className="text-gray-700 mb-4">
            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.
          </p>
          
          <p className="text-gray-700">
            California law requires us to let you know how we respond to web browser DNT signals. Because there currently is not an industry or legal standard for recognizing or honoring DNT signals, we do not respond to them at this time.
          </p>
        </section>

        {/* Section 11: US Residents Privacy Rights */}
        <section id="us-laws" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h2>
          <p className="text-gray-700 mb-6">
            <strong><em>In Short:</em></strong> <em>If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. More information is provided below.</em>
          </p>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Categories of Personal Information We Collect</h3>
            <p className="text-gray-700 mb-4">
              The table below shows the categories of personal information we have collected in the past twelve (12) months. The table includes illustrative examples of each category and does not reflect the personal information we collect from you. For a comprehensive inventory of all personal information we process, please refer to the section "WHAT INFORMATION DO WE COLLECT?"
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Category</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Examples</th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Collected</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">A. Identifiers</td>
                    <td className="border border-gray-300 px-4 py-2">Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">B. Personal information as defined in the California Customer Records statute</td>
                    <td className="border border-gray-300 px-4 py-2">Name, contact information, education, employment, employment history, and financial information</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">YES</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">C. Protected classification characteristics under state or federal law</td>
                    <td className="border border-gray-300 px-4 py-2">Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">D. Commercial information</td>
                    <td className="border border-gray-300 px-4 py-2">Transaction information, purchase history, financial details, and payment information</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">E. Biometric information</td>
                    <td className="border border-gray-300 px-4 py-2">Fingerprints and voiceprints</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">F. Internet or other similar network activity</td>
                    <td className="border border-gray-300 px-4 py-2">Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">G. Geolocation data</td>
                    <td className="border border-gray-300 px-4 py-2">Device location</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">H. Audio, electronic, sensory, or similar information</td>
                    <td className="border border-gray-300 px-4 py-2">Images and audio, video or call recordings created in connection with our business activities</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">I. Professional or employment-related information</td>
                    <td className="border border-gray-300 px-4 py-2">Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">J. Education Information</td>
                    <td className="border border-gray-300 px-4 py-2">Student records and directory information</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">K. Inferences drawn from collected personal information</td>
                    <td className="border border-gray-300 px-4 py-2">Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual's preferences and characteristics</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">L. Sensitive personal Information</td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                    <td className="border border-gray-300 px-4 py-2 text-center">NO</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-4">
            <li>Receiving help through our customer support channels;</li>
            <li>Participation in customer surveys or contests; and</li>
            <li>Facilitation in the delivery of our Services and to respond to your inquiries.</li>
          </ul>
          
          <p className="text-gray-700 mb-4">We will use and retain the collected personal information as needed to provide the Services or for:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-6">
            <li>Category B - As long as the user has an account with us</li>
          </ul>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Sources of Personal Information</h3>
            <p className="text-gray-700">Learn more about the sources of personal information we collect in "WHAT INFORMATION DO WE COLLECT?"</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">How We Use and Share Personal Information</h3>
            <p className="text-gray-700">Learn more about how we use your personal information in the section, "HOW DO WE PROCESS YOUR INFORMATION?"</p>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Will your information be shared with anyone else?</h4>
            <p className="text-gray-700">We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Learn more about how we disclose personal information to in the section, "WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?"</p>
          </div>
          
          <p className="text-gray-700 mb-4">
            We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be "selling" of your personal information.
          </p>
          
          <p className="text-gray-700 mb-6">
            We have not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. We will not sell or share personal information in the future belonging to website visitors, users, and other consumers.
          </p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Rights</h3>
            <p className="text-gray-700 mb-4">You have rights under certain US state data protection laws. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law. These rights include:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li><strong>Right to know</strong> whether or not we are processing your personal data</li>
              <li><strong>Right to access</strong> your personal data</li>
              <li><strong>Right to correct</strong> inaccuracies in your personal data</li>
              <li><strong>Right to request</strong> the deletion of your personal data</li>
              <li><strong>Right to obtain a copy</strong> of the personal data you previously shared with us</li>
              <li><strong>Right to non-discrimination</strong> for exercising your rights</li>
              <li><strong>Right to opt out</strong> of the processing of your personal data if it is used for targeted advertising (or sharing as defined under California's privacy law), the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects ("profiling")</li>
            </ul>
          </div>
          
          <p className="text-gray-700 mb-4">Depending upon the state where you live, you may also have the following rights:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-6">
            <li>Right to access the categories of personal data being processed (as permitted by applicable law, including the privacy law in Minnesota)</li>
            <li>Right to obtain a list of the categories of third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in California, Delaware, and Maryland)</li>
            <li>Right to obtain a list of specific third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in Minnesota and Oregon)</li>
            <li>Right to review, understand, question, and correct how personal data has been profiled (as permitted by applicable law, including the privacy law in Minnesota)</li>
            <li>Right to limit use and disclosure of sensitive personal data (as permitted by applicable law, including the privacy law in California)</li>
            <li>Right to opt out of the collection of sensitive data and personal data collected through the operation of a voice or facial recognition feature (as permitted by applicable law, including the privacy law in Florida)</li>
          </ul>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Exercise Your Rights</h3>
            <p className="text-gray-700 mb-4">
              To exercise these rights, you can contact us by submitting a{' '}
              <a href="https://app.termly.io/dsar/5211d9dd-77a1-438a-9535-c757447565e8" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">data subject access request</a>, 
              by emailing us at <a href="mailto:support@youguide.com" className="text-blue-600 hover:underline">support@youguide.com</a>, or by referring to the contact details at the bottom of this document.
            </p>
            
            <p className="text-gray-700 mb-4">
              Under certain US state data protection laws, you can designate an authorized agent to make a request on your behalf. We may deny a request from an authorized agent that does not submit proof that they have been validly authorized to act on your behalf in accordance with applicable laws.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Request Verification</h3>
            <p className="text-gray-700 mb-4">
              Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. We will only use personal information provided in your request to verify your identity or authority to make the request. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes.
            </p>
            
            <p className="text-gray-700 mb-4">
              If you submit the request through an authorized agent, we may need to collect additional information to verify your identity before processing your request and the agent will need to provide a written and signed permission from you to submit such request on your behalf.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Appeals</h3>
            <p className="text-gray-700 mb-4">
              Under certain US state data protection laws, if we decline to take action regarding your request, you may appeal our decision by emailing us at{' '}
              <a href="mailto:support@youguide.com" className="text-blue-600 hover:underline">support@youguide.com</a>. 
              We will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions. If your appeal is denied, you may submit a complaint to your state attorney general.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">California "Shine The Light" Law</h3>
            <p className="text-gray-700">
              California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?"
            </p>
          </div>
        </section>

        {/* Section 12: Other Regions */}
        <section id="other-laws" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?</h2>
          <p className="text-gray-700 mb-4">
            <strong><em>In Short:</em></strong> <em>You may have additional rights based on the country you reside in.</em>
          </p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Australia and New Zealand</h3>
            <p className="text-gray-700 mb-4">
              We collect and process your personal information under the obligations and conditions set by Australia's Privacy Act 1988 and New Zealand's Privacy Act 2020 (Privacy Act).
            </p>
            
            <p className="text-gray-700 mb-4">
              This Privacy Notice satisfies the notice requirements defined in both Privacy Acts, in particular: what personal information we collect from you, from which sources, for which purposes, and other recipients of your personal information.
            </p>
            
            <p className="text-gray-700 mb-4">
              If you do not wish to provide the personal information necessary to fulfill their applicable purpose, it may affect our ability to provide our services, in particular:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-4">
              <li>offer you the products or services that you want</li>
              <li>respond to or help with your requests</li>
              <li>manage your account with us</li>
              <li>confirm your identity and protect your account</li>
            </ul>
            
            <p className="text-gray-700 mb-4">
              At any time, you have the right to request access to or correction of your personal information. You can make such a request by contacting us by using the contact details provided in the section "HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?"
            </p>
            
            <p className="text-gray-700 mb-4">
              If you believe we are unlawfully processing your personal information, you have the right to submit a complaint about a breach of the Australian Privacy Principles to the{' '}
              <a href="https://www.oaic.gov.au/privacy/privacy-complaints/lodge-a-privacy-complaint-with-us" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Office of the Australian Information Commissioner</a>{' '}
              and a breach of New Zealand's Privacy Principles to the{' '}
              <a href="https://www.privacy.org.nz/your-rights/making-a-complaint/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Office of New Zealand Privacy Commissioner</a>.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Republic of South Africa</h3>
            <p className="text-gray-700 mb-4">
              At any time, you have the right to request access to or correction of your personal information. You can make such a request by contacting us by using the contact details provided in the section "HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?"
            </p>
            
            <p className="text-gray-700 mb-4">
              If you are unsatisfied with the manner in which we address any complaint with regard to our processing of personal information, you can contact the office of the regulator, the details of which are:
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                <a href="https://inforegulator.org.za/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">The Information Regulator (South Africa)</a>
              </p>
              <p className="text-gray-700 mb-1">
                General enquiries: <a href="mailto:enquiries@inforegulator.org.za" className="text-blue-600 hover:underline">enquiries@inforegulator.org.za</a>
              </p>
              <p className="text-gray-700">
                Complaints (complete POPIA/PAIA form 5): <a href="mailto:PAIAComplaints@inforegulator.org.za" className="text-blue-600 hover:underline">PAIAComplaints@inforegulator.org.za</a> & <a href="mailto:POPIAComplaints@inforegulator.org.za" className="text-blue-600 hover:underline">POPIAComplaints@inforegulator.org.za</a>
              </p>
            </div>
          </div>
        </section>

        {/* Section 13: Policy Updates */}
        <section id="policy-updates" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">13. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
          <p className="text-gray-700 mb-4">
            <strong><em>In Short:</em></strong> <em>Yes, we will update this notice as necessary to stay compliant with relevant laws.</em>
          </p>
          
          <p className="text-gray-700">
            We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.
          </p>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
          <p className="text-gray-700 mb-4">
            If you have questions or comments about this notice, you may email us at{' '}
            <a href="mailto:support@youguide.com" className="text-blue-600 hover:underline">support@youguide.com</a> or contact us by post at:
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-gray-700">
              <p className="font-semibold">Youguide</p>
              <p>__________</p>
              <p>__________</p>
              <p>Belgium</p>
            </div>
          </div>
        </section>

        {/* Data Access Section */}
        <section id="request" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">15. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
          <p className="text-gray-700 mb-4">
            Based on the applicable laws of your country or state of residence in the US, you may have the right to request access to the personal information we collect from you, 
            details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. 
            These rights may be limited in some circumstances by applicable law.
          </p>
          
          <p className="text-gray-700">
            To request to review, update, or delete your personal information, please fill out and submit a{' '}
            <a 
              href="https://app.termly.io/dsar/5211d9dd-77a1-438a-9535-c757447565e8" 
              className="text-blue-600 hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              data subject access request
            </a>.
          </p>
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-12 pt-8 border-t border-gray-200">
          <p>This privacy policy is effective as of October 02, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;