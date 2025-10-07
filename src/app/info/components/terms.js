import React from 'react';
import config from 'brand/config';

import TermsSeg from './terms-seg';

const Terms = () => {
  if (config.registrationFlow === '2') {
    return <TermsSeg />;
  } else {
    return (
      <div className="terms p-30">
        <p className="has-text-centered p1 p-b-20">
          Terms and Conditions of using {config.fulTitle}’s services
        </p>

        <p className="has-text-left p1 p-b-20">Introduction</p>
        <p className="p-b-10">
          For the purpose of these terms and conditions the following words will
          have the following meanings: “We”, “us” “our” meaning{' '}
          {config.fulTitle}
          {config.registeredCompany}. Registered address:{' '}
          {config.registeredAddress}.
        </p>
        <p className="p-b-20">
          “You”, “your” meaning the person or entity registering to use our
          services including, learners, employers and training providers.
        </p>

        <p className="has-text-left p1 p-b-20">Registration</p>
        <p className="p-b-10">
          Only one registration per person, employer or training provider is
          allowed. You must keep all your information up to date. You must use
          an email address that you have frequent access to, as we need to be
          able to contact you via email.
        </p>
        <p className="p-b-10">
          You must ensure to keep your password confidential and not share with
          anyone else. Please be aware that you will be held responsible for any
          activity in your account whether it be on the website or on an
          application. If you believe that someone may have access to or is
          using your account, you must inform us immediately on {config.email}.
        </p>

        <p>You must not:</p>
        <ul>
          <li>Impersonate, or attempt to impersonate someone else;</li>
          <li>Allow anyone else to use your account; or</li>
          <li className="p-b-20">Use anyone else’s account.</li>
        </ul>

        <p className="has-text-left p1 p-b-20">Provision of Information</p>
        <p className="p-b-10">
          You acknowledge that in order to use the {config.fulTitle}’s services
          you may be required to provide personal information to us.
        </p>
        <p className="p-b-10">
          By submitting an application form and purchasing a licence, you give
          consent to {config.fulTitle} to obtain, keep, use and produce
          information relating to your membership in line with the requirements
          of the Data Protection Act 1998. You agree that you understand that
          you have registered and this application form will become part of your
          profile.
        </p>
        <p className="p-b-10">
          You certify the information provided is correct to the best of your
          knowledge and all entries on the application form are correct and
          complete.
        </p>
        <p className="p-b-10">
          Please note that we will only use personal information you send us for
          the purposes for which you provide it. We will only hold your
          information for as long as necessary for these purposes and will not
          pass it on to any other parties, except where required to carry out
          our duties and functions as an e-learning provider.
        </p>
        <p className="p-b-20">
          All employees and subsidiaries that may have access to your personal
          data are obliged to respect the confidentiality of your personal data.
          All your communications to us are protected against unauthorised
          access by third parties. We do not store credit card details nor do we
          share customer details with any third party.
        </p>

        <p className="has-text-left p1 p-b-20">Your Personal Information</p>
        <p className="p-b-20">
          As stated above, we will only use your personal information in
          accordance with our Internet privacy policy, which forms part of these
          terms and conditions. Please click here to read the Privacy Policy.
        </p>

        <p className="has-text-left p1 p-b-20">
          Using Our Sites and Applications
        </p>
        <p className="p-b-10">
          You may view, listen to and interact with the website and applications
          for educational purposes. You may occasionally print individual pages
          on the site or the applications for educational purposes given that
          such printing is not substantial or methodical and that our trademarks
          and copyright are not removed.
        </p>
        <p className="p-b-10">
          You must not, whether directly or indirectly, copy, download, store,
          make available, distribute, sell or offer to sell all or any part of
          the content, files or data on our websites and applications to make or
          populate a database or publication of any kind without our written
          consent.
        </p>
        <p className="p-b-10">
          You must not use all or any part of our site and applications for
          commercial purposes without our prior written consent.
        </p>
        <p className="p-b-20">
          Users, whether registered or not, must not abuse the websites or
          applications by uploading false or malicious information.
        </p>

        <p className="has-text-left p1 p-b-20">Acceptable Use</p>
        <p className="p-b-10">
          You agree to use {config.fulTitle}’s services solely for lawful
          purposes. You acknowledge and agree that you will be held responsible
          for any communications and content shared or transmitted by you using{' '}
          {config.fulTitle}’s services. You further acknowledge and agree that
          you hold all intellectual rights of the content and communications,
          transmitted, published or shared or that you have obtained permission
          from the third party that holds the intellectual property rights to
          share or transmit it using {config.fulTitle}’s services.
        </p>

        <p>
          You agree not to use {config.fulTitle}’s services for any of the
          following:
        </p>
        <ul>
          <li>Send mass mailings or spam</li>
          <li>Collect or store information about other users</li>
          <li>Threaten or harass any fellow users</li>
          <li>
            Infringe on another user’s or third party’s intellectual rights
          </li>
          <li>
            Share or transmit any material or encourage to share or transmit any
            material that is obscene, unlawful, defamatory, hateful, racist,
            illegal or encourages criminal behaviour
          </li>
          <li>
            Share or transmit any content which may include viruses or other
            harmful or destructive material
          </li>
          <li>
            Hack or gain unauthorised access to any {config.fulTitle}’s server,
            network or hardware
          </li>
          <li>
            Use {config.fulTitle}’s services in any way that could overload,
            damage, disrupt or harm the system
          </li>
          <li>Adapt or modify any of our systems</li>
          <li>Register user accounts using automated processes</li>
          <li className="p-b-10">
            Reformat, resell or redistribute {config.fulTitle}’s services or
            systems without the prior written consent.
          </li>
        </ul>
        <p className="p-b-20">
          You acknowledge that {config.fulTitle} reserves the right to suspend
          or terminate your account at any time in order to ensure fair use.
        </p>

        <p className="has-text-left p1 p-b-20">
          Suspending or Terminating Your Account
        </p>
        <p className="p-b-10">
          {config.fulTitle} reserves the right to suspend or terminate your
          account at any time. The main reason for suspending or terminating
          your account would be due to breaching these terms or conditions.
        </p>
        <p className="p-b-20">
          If you would like to terminate your account, please contact us by
          calling {config.phoneNumber} or email {config.email}.
        </p>

        <p className="has-text-left p1 p-b-20">Maintenance of the System</p>
        <p className="p-b-10">
          In order to make the use of the website and the applications as
          enjoyable as possible, we may need to make changes to the system which
          may cause slight disruption to the services from time to time. We
          always endeavour to make these changes and maintenance work at times
          which would be least disrupting for all and we will ensure to inform
          all members of any major maintenance work which could cause the system
          to be offline for some time.
        </p>
        <p className="p-b-10">
          You acknowledge and agree that the maintenance is necessary and that
          we are not liable for any inconvenience caused due to the maintenance
          work.
        </p>
      </div>
    );
  }
};

export default Terms;
