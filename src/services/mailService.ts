import * as brevo from '@getbrevo/brevo';

type BrevoOptions = {
  to: string;
  subject: string;
  text: string;
};

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!
);

const sendSmtpEmail = new brevo.SendSmtpEmail();

export const sendMail = ({ to, subject, text }: BrevoOptions) => {
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.textContent = text;
  sendSmtpEmail.to = [{ email: to, name: '-' }];
  sendSmtpEmail.sender = {
    name: 'simple-txt',
    email: 'mdahmed.domain@gmail.com',
  };
  sendSmtpEmail.replyTo = {
    name: 'MD Ahmed',
    email: 'mdahmed.domain@gmail.com',
  };

  return apiInstance.sendTransacEmail(sendSmtpEmail);
};
