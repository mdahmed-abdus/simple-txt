import { Resend } from 'resend';
import { CreateEmailOptions } from 'resend/build/src/emails/interfaces';

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM = 'simple-txt noreply <simple-txt@resend.dev>';

export const sendMail = (options: CreateEmailOptions) =>
  resend.emails.send({ ...options, from: FROM });
