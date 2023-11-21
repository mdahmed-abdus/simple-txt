import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM = 'simple-txt noreply <simple-txt@resend.dev>';

export const sendMail = (options: any) =>
  resend.emails.send({ ...options, from: FROM });
