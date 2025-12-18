import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  verificationUrl: string; // <-- FIXED (was otp before)
}

export default function VerificationEmail({
  username,
  verificationUrl,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Email Verification</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>Email verification link</Preview>

      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>

        <Row>
          <Text>
            Thank you for registering. Please click the button below to verify
            your email.
          </Text>
        </Row>

        <Row style={{ marginTop: "20px", marginBottom: "20px" }}>
          <Button
            href={verificationUrl}
            style={{
              backgroundColor: "#4f46e5",
              color: "white",
              padding: "12px 20px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Verify Email
          </Button>
        </Row>

        <Row>
          <Text>
            Or copy and paste this link into your browser:
            <br />
            {verificationUrl}
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
