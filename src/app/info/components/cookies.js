import React from 'react';
import config from 'brand/config';

const Cookies = () =>
  <div className="cookies p-30">
    <p className="has-text-centered p1 p-b-20">
      {config.fulTitle} Cookie Policy
    </p>

    <p className="p-b-20">
      This Cookie Policy (the “Policy”) applies to ordinary user and member
      usage of the {config.fulTitle} (the “Company”) website, which appears at
      {config.website}. (the “Website”).
    </p>

    <p className="has-text-left p1 p-b-20">Cookie</p>
    <p className="p-b-10">
      A cookie is a text file that is stored on a user’s computer, tablet,
      telephone or any other device by the Website in order to remember whom the
      user is. Only the Website’s server has access to that cookie to read or
      retrieve information.
    </p>
    <p className="p-b-20">
      The cookie only contains some anonymous information such as the site’s
      name, unique identification number and other digits. Each cookie is unique
      to the browser being used. Cookies allow the Website to remember user
      preferences, habits and other basic information. Cookies are used by most
      major websites.
    </p>

    <p className="has-text-left p1 p-b-20">Why are Cookies Used?</p>
    <p className="p-b-20">
      Cookies are used for many different purposes. The Website uses cookies to
      make the conversation between the Website and the user faster and to allow
      users to navigate between pages efficiently, storing preferences, and
      generally improving user experience. If the Website did not use cookies,
      it would think that a user is a new visitor every time they navigate to a
      new page, meaning that a member would have to log in to the system on
      every page.
    </p>

    <p className="has-text-left p1 p-b-20">Cookie Preferences</p>
    <p className="p-b-20">
      All users have the right and ability to edit their cookie preferences;
      this can be done by amending browser settings. As all browsers are
      different, users are advised to seek help from their browser support team
      if necessary. However, users must keep in mind that disabling cookies may
      restrict access to parts of the Website, decrease user experience and make
      the communications between the Website and the user slower.
    </p>

    <p className="has-text-left p1 p-b-20">Consent</p>
    <p className="p-b-10">
      By using the Website, all individuals agree to the use of cookies unless
      otherwise stated by amending of browser settings.
    </p>
    <p className="p-b-20">
      To find out more about cookies please visit{' '}
      <a href="http://www.cookiecentral.com">www.cookiecentral.com</a>.
    </p>
  </div>;

export default Cookies;
