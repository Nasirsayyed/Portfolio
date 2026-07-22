import { personalInfo } from '@/data/portfolio';

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!values.email.trim()) {
    errors.email = 'Please enter your email.';
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!values.subject.trim()) errors.subject = 'Please add a subject.';
  if (!values.message.trim()) {
    errors.message = 'Please write a message.';
  } else if (values.message.trim().length < 10) {
    errors.message = 'Message should be at least 10 characters.';
  }

  return errors;
}

/**
 * No backend/email service is wired up (EmailJS/Formspree/Resend, etc.),
 * so this opens the visitor's mail client with a prefilled message —
 * a genuinely working send path rather than a simulated one. Swap the
 * body of this function for a real API/provider call when one is added.
 */
export function sendContactMessage(values: ContactFormValues): void {
  const body = `${values.message}\n\n— ${values.name} (${values.email})`;
  const mailto = `mailto:${personalInfo.email}?subject=${encodeURIComponent(
    values.subject,
  )}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}
