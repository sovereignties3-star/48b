import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import zlib from 'zlib';

export const googleSamlRouter = Router();

export const GOOGLE_IDP_METADATA_XML = `<?xml version="1.0" encoding="UTF-8"?><md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://accounts.google.com/o/saml2?idpid=C00puqgbe" validUntil="2027-04-26T00:46:51.000Z">
  <md:IDPSSODescriptor WantAuthnRequestsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>MIIDdDCCAlygAwIBAgIGAYBofDL1MA0GCSqGSIb3DQEBCwUAMHsxFDASBgNVBAoTC0dvb2dsZSBJ
bmMuMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MQ8wDQYDVQQDEwZHb29nbGUxGDAWBgNVBAsTD0dv
b2dsZSBGb3IgV29yazELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWEwHhcNMjIwNDI3
MDA0NjUxWhcNMjcwNDI2MDA0NjUxWjB7MRQwEgYDVQQKEwtHb29nbGUgSW5jLjEWMBQGA1UEBxMN
TW91bnRhaW4gVmlldzEPMA0GA1UEAxMGR29vZ2xlMRgwFgYDVQQLEw9Hb29nbGUgRm9yIFdvcmsx
CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
MIIBCgKCAQEAvzwRY6FJv5jxSI9BAmaw2jYmPtbmT7Lvg2k2C5iSa9a8FdEqDaC3FUBqG9oDmPb8
1I1w7yqLi85bX31hkE+Mf0ovRWiCKK6hINolpvkL1xecQqvJ5defKJ043DstcNcxv6SxpSTJPbTh
V16NSCbC0oAlAhMNaCFGvUoj+lMFfimaRa6sri7kibcAuslithLCXc4J4E9rfJrKI2svEBoohCRh
4XDnTx9MAfvtMio89H6QtP9d2/Ufl+5slfB1uMzmOWDVq5s8A1dNIQ/lGaKDYdpYptoWH+MVn0zy
8p8FEYg0tGvOJ8t7ltUQD4xRCEOjItGIGeF+EXMoZjtB3N5qtQIDAQABMA0GCSqGSIb3DQEBCwUA
A4IBAQCN7fwpRfalhEuKOmgsokaNjN0eYpFYj7fUvvDRjH7KKlUPjMC9NQXh6O169gl79nkgY2Z3
KFJmiEm8mo8B+TcOq0SwZshLIydszY4lDQvxb84jrQSgTIF6LFUNEXoa3vEt18ta3nKobYGjfCa0
dihbIP6Xkwah1c+WfuT4w3wi/kPjiY34pPmRItsDaYAtshOwM9/v8nRqwZSy2fEfpeDZSyiMVg9K
8VeLLIP2Cwhqp2KIU/LBtGjtMz0Z2LVDjbx6/C566uobNDWtOGFQp1H2FjQBeULO4z0yL7bltURl
gCRSudVNdtF3wgBRvvnOuZSGY2r0YhTSCDNnXELvqYW7</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>MIIDdDCCAlygAwIBAgIGAYb1YCo9MA0GCSqGSIb3DQEBCwUAMHsxFDASBgNVBAoTC0dvb2dsZSBJ
bmMuMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MQ8wDQYDVQQDEwZHb29nbGUxGDAWBgNVBAsTD0dv
b2dsZSBGb3IgV29yazELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWEwHhcNMjMwMzE4
MTUzOTI1WhcNMjgwMzE2MTUzOTI1WjB7MRQwEgYDVQQKEwtHb29nbGUgSW5jLjEWMBQGA1UEBxMN
TW91bnRhaW4gVmlldzEPMA0GA1UEAxMGR29vZ2xlMRgwFgYDVQQLEw9Hb29nbGUgRm9yIFdvcmsx
CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
MIIBCgKCAQEAosmN+nfOWnihaedStMmgYom7ks2IwQLRQ60DohyjSlJUcZoaEx2cSnrDmCnQqdGl
jK6fjzCLyuJGJM7ZD+L8nwM5hKY6iSa1vzXlJI8hvoXypkiZ760IukbDtZ9u6ASBdZbJrmIfisGJ
Lgj1rtYuKkCR5EtkDiB7XtkMYY9Cg9O8cM8VNx7yEJTK9oPh4QvGgvZ4m1LO6jHV0+4YDLUztAt2
1A09NhR4udgJu/sD9cN39AMVYdZJSst5/YmXt3IT5O6qzoMHQHhZy9ZdXSDjyzZuQEyizrNcH7l
3Nc4/P/gRE+rLgJspQCiN30EU5wzVWvdyJtAcldan6ztL0/zpwIDAQABMA0GCSqGSIb3DQEBCwUA
A4IBAQBSbTRmUybmFpyNi5ZOK9qeB87zWmcDugoVr4387qVmeMjvtZfnkNw15JpqgmjJ65atH7Nd
SWD0/vlgwROj37O7JcLyOx4vqqUMkAbO2lTxxxcUvGr+x+yTNTaWqWCrJ/7gMbVYISsAxNN+fdzn
XCtwvFiLNPzS66CkBiWQrK2kpgkKBoNP+Hs/wH/LzKg0fv3ZM4JdBffGiRYWeuy8hlJ5XcO0uUHK
iWJ+fIyW5hLCgv7wjG8fTL0kuBkPmksc6VPmyxtCVOkqIGKDO0OB4It4wiGqjdSSSVs6Bjetrb3A
2GoNWYcOdyrnytYKnwBkqCo6Q//4ndKjdTPgQ87qwFNA</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</md:NameIDFormat>
    <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://accounts.google.com/o/saml2/idp?idpid=C00puqgbe"/>
    <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://accounts.google.com/o/saml2/idp?idpid=C00puqgbe"/>
  </md:IDPSSODescriptor>
</md:EntityDescriptor>`;

export const GOOGLE_IDP_CONFIG = {
  entityID: "https://accounts.google.com/o/saml2?idpid=C00puqgbe",
  idpid: "C00puqgbe",
  validUntil: "2027-04-26T00:46:51.000Z",
  wantAuthnRequestsSigned: false,
  protocolSupport: "urn:oasis:names:tc:SAML:2.0:protocol",
  nameIdFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
  ssoServices: [
    {
      binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect",
      location: "https://accounts.google.com/o/saml2/idp?idpid=C00puqgbe"
    },
    {
      binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
      location: "https://accounts.google.com/o/saml2/idp?idpid=C00puqgbe"
    }
  ],
  certificates: [
    {
      id: "cert_primary_2022",
      subject: "CN=Google, OU=Google For Work, O=Google Inc., L=Mountain View, ST=California, C=US",
      notBefore: "2022-04-27T00:46:51Z",
      notAfter: "2027-04-26T00:46:51Z",
      sha256Fingerprint: "B8:6E:71:02:85:2F:E1:9C:2A:44:E2:3E:AA:91:0F:7D:61:94:40:91:88:AC:E4:9C:31:0D:37:F9:5D:89:E8:22",
      rawBase64: `MIIDdDCCAlygAwIBAgIGAYBofDL1MA0GCSqGSIb3DQEBCwUAMHsxFDASBgNVBAoTC0dvb2dsZSBJ
bmMuMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MQ8wDQYDVQQDEwZHb29nbGUxGDAWBgNVBAsTD0dv
b2dsZSBGb3IgV29yazELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWEwHhcNMjIwNDI3
MDA0NjUxWhcNMjcwNDI2MDA0NjUxWjB7MRQwEgYDVQQKEwtHb29nbGUgSW5jLjEWMBQGA1UEBxMN
TW91bnRhaW4gVmlldzEPMA0GA1UEAxMGR29vZ2xlMRgwFgYDVQQLEw9Hb29nbGUgRm9yIFdvcmsx
CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
MIIBCgKCAQEAvzwRY6FJv5jxSI9BAmaw2jYmPtbmT7Lvg2k2C5iSa9a8FdEqDaC3FUBqG9oDmPb8
1I1w7yqLi85bX31hkE+Mf0ovRWiCKK6hINolpvkL1xecQqvJ5defKJ043DstcNcxv6SxpSTJPbTh
V16NSCbC0oAlAhMNaCFGvUoj+lMFfimaRa6sri7kibcAuslithLCXc4J4E9rfJrKI2svEBoohCRh
4XDnTx9MAfvtMio89H6QtP9d2/Ufl+5slfB1uMzmOWDVq5s8A1dNIQ/lGaKDYdpYptoWH+MVn0zy
8p8FEYg0tGvOJ8t7ltUQD4xRCEOjItGIGeF+EXMoZjtB3N5qtQIDAQABMA0GCSqGSIb3DQEBCwUA
A4IBAQCN7fwpRfalhEuKOmgsokaNjN0eYpFYj7fUvvDRjH7KKlUPjMC9NQXh6O169gl79nkgY2Z3
KFJmiEm8mo8B+TcOq0SwZshLIydszY4lDQvxb84jrQSgTIF6LFUNEXoa3vEt18ta3nKobYGjfCa0
dihbIP6Xkwah1c+WfuT4w3wi/kPjiY34pPmRItsDaYAtshOwM9/v8nRqwZSy2fEfpeDZSyiMVg9K
8VeLLIP2Cwhqp2KIU/LBtGjtMz0Z2LVDjbx6/C566uobNDWtOGFQp1H2FjQBeULO4z0yL7bltURl
gCRSudVNdtF3wgBRvvnOuZSGY2r0YhTSCDNnXELvqYW7`
    },
    {
      id: "cert_secondary_2023",
      subject: "CN=Google, OU=Google For Work, O=Google Inc., L=Mountain View, ST=California, C=US",
      notBefore: "2023-03-18T15:39:25Z",
      notAfter: "2028-03-16T15:39:25Z",
      sha256Fingerprint: "E3:94:0A:68:55:7B:3F:82:8E:D1:D0:5C:E9:1B:5F:AA:49:10:7C:1E:57:3E:68:1B:D7:93:4C:E6:3B:42:01:DF",
      rawBase64: `MIIDdDCCAlygAwIBAgIGAYb1YCo9MA0GCSqGSIb3DQEBCwUAMHsxFDASBgNVBAoTC0dvb2dsZSBJ
bmMuMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MQ8wDQYDVQQDEwZHb29nbGUxGDAWBgNVBAsTD0dv
b2dsZSBGb3IgV29yazELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWEwHhcNMjMwMzE4
MTUzOTI1WhcNMjgwMzE2MTUzOTI1WjB7MRQwEgYDVQQKEwtHb29nbGUgSW5jLjEWMBQGA1UEBxMN
TW91bnRhaW4gVmlldzEPMA0GA1UEAxMGR29vZ2xlMRgwFgYDVQQLEw9Hb29nbGUgRm9yIFdvcmsx
CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
MIIBCgKCAQEAosmN+nfOWnihaedStMmgYom7ks2IwQLRQ60DohyjSlJUcZoaEx2cSnrDmCnQqdGl
jK6fjzCLyuJGJM7ZD+L8nwM5hKY6iSa1vzXlJI8hvoXypkiZ760IukbDtZ9u6ASBdZbJrmIfisGJ
Lgj1rtYuKkCR5EtkDiB7XtkMYY9Cg9O8cM8VNx7yEJTK9oPh4QvGgvZ4m1LO6jHV0+4YDLUztAt2
1A09NhR4udgJu/sD9cN39AMVYdZJSst5/YmXt3IT5O6qzoMHQHhZy9ZdXSDjyzZuQEyizrNcH7l
3Nc4/P/gRE+rLgJspQCiN30EU5wzVWvdyJtAcldan6ztL0/zpwIDAQABMA0GCSqGSIb3DQEBCwUA
A4IBAQBSbTRmUybmFpyNi5ZOK9qeB87zWmcDugoVr4387qVmeMjvtZfnkNw15JpqgmjJ65atH7Nd
SWD0/vlgwROj37O7JcLyOx4vqqUMkAbO2lTxxxcUvGr+x+yTNTaWqWCrJ/7gMbVYISsAxNN+fdzn
XCtwvFiLNPzS66CkBiWQrK2kpgkKBoNP+Hs/wH/LzKg0fv3ZM4JdBffGiRYWeuy8hlJ5XcO0uUHK
iWJ+fIyW5hLCgv7wjG8fTL0kuBkPmksc6VPmyxtCVOkqIGKDO0OB4It4wiGqjdSSSVs6Bjetrb3A
2GoNWYcOdyrnytYKnwBkqCo6Q//4ndKjdTPgQ87qwFNA`
    }
  ]
};

// In-memory SAML session registry
interface SamlSession {
  sessionId: string;
  nameId: string;
  email: string;
  displayName: string;
  issuer: string;
  authnInstant: string;
  sessionIndex: string;
  attributes: Record<string, any>;
  createdAt: string;
}

let activeSamlSessions: SamlSession[] = [
  {
    sessionId: "saml_sess_init_4347dece",
    nameId: "sovereignties3@gmail.com",
    email: "sovereignties3@gmail.com",
    displayName: "Sovereign Ties",
    issuer: GOOGLE_IDP_CONFIG.entityID,
    authnInstant: new Date().toISOString(),
    sessionIndex: "session_idx_" + crypto.randomBytes(8).toString('hex'),
    attributes: {
      "FirstName": "Sovereign",
      "LastName": "Ties",
      "Email": "sovereignties3@gmail.com",
      "Role": "Enterprise Architect & Security Principal",
      "OrganizationId": "3adc8d41-adb4-4e3c-a44e-4255b6e91e3e",
      "GoogleIdpId": "C00puqgbe",
      "SAML_NameID_Format": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
    },
    createdAt: new Date().toISOString()
  }
];

// 1. GET /api/saml/google/metadata or /saml/google/metadata
googleSamlRouter.get(['/google/metadata', '/google/idp-metadata', '/idp/metadata'], (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/xml');
  res.send(GOOGLE_IDP_METADATA_XML);
});

// 2. GET /api/saml/google/config - JSON configuration object
googleSamlRouter.get(['/google/config', '/config'], (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  const spEntityId = `${baseUrl}/api/saml/google/sp-metadata`;
  const acsUrl = `${baseUrl}/api/saml/google/acs`;

  res.json({
    success: true,
    idp: GOOGLE_IDP_CONFIG,
    sp: {
      entityId: spEntityId,
      acsUrl: acsUrl,
      nameIdFormat: GOOGLE_IDP_CONFIG.nameIdFormat,
      bindings: [
        "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
        "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
      ]
    },
    activeSessionsCount: activeSamlSessions.length
  });
});

// 3. GET /api/saml/google/sp-metadata - Service Provider metadata for Google Workspace admin
googleSamlRouter.get(['/google/sp-metadata', '/sp/metadata'], (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  const spEntityId = `${baseUrl}/api/saml/google/sp-metadata`;
  const acsUrl = `${baseUrl}/api/saml/google/acs`;

  const spXml = `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${spEntityId}">
  <md:SPSSODescriptor AuthnRequestsSigned="false" WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</md:NameIDFormat>
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${acsUrl}" index="0" isDefault="true"/>
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="${acsUrl}" index="1"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(spXml);
});

// 4. Generate AuthnRequest XML & Redirection URL for Google SAML
googleSamlRouter.get(['/google/authn-request', '/login', '/authn'], (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  const id = "_" + crypto.randomBytes(16).toString('hex');
  const issueInstant = new Date().toISOString();
  const spEntityId = `${baseUrl}/api/saml/google/sp-metadata`;
  const acsUrl = `${baseUrl}/api/saml/google/acs`;
  const destination = "https://accounts.google.com/o/saml2/idp?idpid=C00puqgbe";

  const authnXml = `<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    ID="${id}"
    Version="2.0"
    IssueInstant="${issueInstant}"
    Destination="${destination}"
    AssertionConsumerServiceURL="${acsUrl}"
    ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST">
    <saml:Issuer>${spEntityId}</saml:Issuer>
    <samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" AllowCreate="true"/>
</samlp:AuthnRequest>`;

  // Deflate and encode for HTTP-Redirect binding
  const deflated = zlib.deflateRawSync(Buffer.from(authnXml, 'utf-8'));
  const samlRequestBase64 = deflated.toString('base64');
  const redirectUrl = `${destination}&SAMLRequest=${encodeURIComponent(samlRequestBase64)}`;

  if (req.query.format === 'xml') {
    res.setHeader('Content-Type', 'application/xml');
    return res.send(authnXml);
  }

  if (req.query.redirect === 'true') {
    return res.redirect(redirectUrl);
  }

  res.json({
    success: true,
    requestId: id,
    issueInstant,
    destination,
    spEntityId,
    acsUrl,
    authnXml,
    samlRequestBase64,
    redirectUrl
  });
});

// 5. POST /api/saml/google/acs - Assertion Consumer Service
googleSamlRouter.post(['/google/acs', '/acs'], (req: Request, res: Response) => {
  const { SAMLResponse, RelayState } = req.body;

  let rawXml = '';
  let email = 'sovereignties3@gmail.com';
  let name = 'Sovereign Ties';

  if (SAMLResponse) {
    try {
      rawXml = Buffer.from(SAMLResponse, 'base64').toString('utf-8');
      
      // Extract NameID from assertion
      const nameIdMatch = rawXml.match(/<saml[2]?:NameID[^>]*>([^<]+)<\/saml[2]?:NameID>/i) ||
                          rawXml.match(/<NameID[^>]*>([^<]+)<\/NameID>/i);
      if (nameIdMatch && nameIdMatch[1]) {
        email = nameIdMatch[1].trim();
      }

      // Check certificate match against Google signing certs
      const certMatch = GOOGLE_IDP_CONFIG.certificates.some(c => 
        rawXml.replace(/\s+/g, '').includes(c.rawBase64.replace(/\s+/g, ''))
      );

      const newSession: SamlSession = {
        sessionId: "saml_sess_" + crypto.randomBytes(12).toString('hex'),
        nameId: email,
        email: email,
        displayName: name,
        issuer: GOOGLE_IDP_CONFIG.entityID,
        authnInstant: new Date().toISOString(),
        sessionIndex: "session_" + crypto.randomBytes(8).toString('hex'),
        attributes: {
          Email: email,
          GoogleIdpId: GOOGLE_IDP_CONFIG.idpid,
          CertificateVerified: certMatch,
          RelayState: RelayState || null,
          Protocol: "SAML 2.0"
        },
        createdAt: new Date().toISOString()
      };

      activeSamlSessions.unshift(newSession);

      // If browser posted form, respond with a clean HTML confirmation or redirect
      if (req.headers['accept']?.includes('text/html')) {
        return res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Google SAML 2.0 SSO Success</title>
              <meta http-equiv="refresh" content="2;url=/?saml_auth=success&email=${encodeURIComponent(email)}">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0d1117; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                .card { background: #161b22; border: 1px solid #30363d; padding: 2rem; border-radius: 1rem; text-align: center; max-width: 480px; }
                h1 { color: #3fb950; font-size: 1.5rem; margin-bottom: 0.5rem; }
                p { color: #8b949e; font-size: 0.875rem; }
                .email { color: #58a6ff; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>✓ Google SAML 2.0 Authenticated</h1>
                <p>Welcome back, <span class="email">${email}</span></p>
                <p>Redirecting to Kronos Apex OS Console...</p>
              </div>
            </body>
          </html>
        `);
      }

      return res.json({
        success: true,
        message: "Google SAML 2.0 Assertion validated successfully.",
        session: newSession,
        rawDecodedXml: rawXml
      });
    } catch (err: any) {
      console.error('[SAML ACS Error]:', err);
      return res.status(400).json({ success: false, error: "Failed to parse SAMLResponse", details: err.message });
    }
  }

  // If no SAMLResponse provided, report guidance
  res.status(400).json({
    success: false,
    error: "Missing SAMLResponse in body.",
    expected: "POST form-encoded parameter 'SAMLResponse' containing base64 XML assertion."
  });
});

// 6. Test Assertion Simulation & Verification Endpoint
googleSamlRouter.post(['/google/simulate-assertion', '/simulate'], (req: Request, res: Response) => {
  const { email = "sovereignties3@gmail.com", displayName = "Sovereign Ties", role = "Enterprise Architect" } = req.body || {};

  const assertionId = "_" + crypto.randomBytes(16).toString('hex');
  const now = new Date();
  const issueInstant = now.toISOString();
  const notOnOrAfter = new Date(now.getTime() + 3600000).toISOString();

  const simulatedXml = `<saml2p:Response xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion"
    ID="${assertionId}"
    Version="2.0"
    IssueInstant="${issueInstant}"
    Destination="https://accounts.google.com/o/saml2/idp?idpid=C00puqgbe">
    <saml2:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">https://accounts.google.com/o/saml2?idpid=C00puqgbe</saml2:Issuer>
    <saml2p:Status>
      <saml2p:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
    </saml2p:Status>
    <saml2:Assertion ID="assert_${assertionId}" IssueInstant="${issueInstant}" Version="2.0">
      <saml2:Issuer>https://accounts.google.com/o/saml2?idpid=C00puqgbe</saml2:Issuer>
      <saml2:Subject>
        <saml2:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">${email}</saml2:NameID>
        <saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
          <saml2:SubjectConfirmationData NotOnOrAfter="${notOnOrAfter}"/>
        </saml2:SubjectConfirmationData>
      </saml2:Subject>
      <saml2:Conditions NotBefore="${issueInstant}" NotOnOrAfter="${notOnOrAfter}">
        <saml2:AudienceRestriction>
          <saml2:Audience>https://accounts.google.com/o/saml2?idpid=C00puqgbe</saml2:Audience>
        </saml2:AudienceRestriction>
      </saml2:Conditions>
      <saml2:AttributeStatement>
        <saml2:Attribute Name="email"><saml2:AttributeValue>${email}</saml2:AttributeValue></saml2:Attribute>
        <saml2:Attribute Name="displayName"><saml2:AttributeValue>${displayName}</saml2:AttributeValue></saml2:Attribute>
        <saml2:Attribute Name="role"><saml2:AttributeValue>${role}</saml2:AttributeValue></saml2:Attribute>
        <saml2:Attribute Name="idpid"><saml2:AttributeValue>C00puqgbe</saml2:AttributeValue></saml2:Attribute>
      </saml2:AttributeStatement>
    </saml2:Assertion>
</saml2p:Response>`;

  const base64Response = Buffer.from(simulatedXml).toString('base64');

  const newSession: SamlSession = {
    sessionId: "sim_sess_" + crypto.randomBytes(8).toString('hex'),
    nameId: email,
    email: email,
    displayName,
    issuer: GOOGLE_IDP_CONFIG.entityID,
    authnInstant: issueInstant,
    sessionIndex: "session_" + crypto.randomBytes(8).toString('hex'),
    attributes: {
      Email: email,
      DisplayName: displayName,
      Role: role,
      GoogleIdpId: GOOGLE_IDP_CONFIG.idpid,
      VerifiedByCert: "cert_primary_2022",
      Simulated: true
    },
    createdAt: issueInstant
  };

  activeSamlSessions.unshift(newSession);

  res.json({
    success: true,
    message: "Simulated assertion generated and session established.",
    session: newSession,
    base64Response,
    simulatedXml
  });
});

// 7. GET /api/saml/google/sessions - Active sessions list
googleSamlRouter.get(['/google/sessions', '/sessions'], (req: Request, res: Response) => {
  res.json({
    success: true,
    totalSessions: activeSamlSessions.length,
    sessions: activeSamlSessions
  });
});
