import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import {
  sendContactMessage,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from '@/utils/contact';

const initialValues: ContactFormValues = { name: '', email: '', subject: '', message: '' };

const FIELDS: {
  key: keyof ContactFormValues;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder: string;
  multiline?: boolean;
}[] = [
  { key: 'name', label: 'Name', autoComplete: 'name', placeholder: 'Your name' },
  { key: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'you@company.com' },
  { key: 'subject', label: 'Subject', placeholder: 'A role, a project, a question' },
  { key: 'message', label: 'Message', placeholder: 'Tell me what you are building…', multiline: true },
];

/** Validates locally, then hands off to the visitor's mail client (no backend is wired up). */
export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [sent, setSent] = useState(false);

  const onChange = (field: keyof ContactFormValues) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSent(false);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      const first = FIELDS.find((f) => validation[f.key]);
      if (first) document.getElementById(`contact-${first.key}`)?.focus();
      return;
    }
    sendContactMessage(values);
    setSent(true);
    setValues(initialValues);
  };

  const field =
    'w-full border-b bg-transparent py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent';

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
      {FIELDS.map(({ key, label, type = 'text', autoComplete, placeholder, multiline }) => {
        const error = errors[key];
        const shared = {
          id: `contact-${key}`,
          name: key,
          value: values[key],
          onChange: onChange(key),
          placeholder,
          'aria-invalid': Boolean(error),
          'aria-describedby': error ? `contact-${key}-error` : undefined,
          className: `${field} ${error ? 'border-red-700 dark:border-red-400' : 'border-foreground/20'}`,
        };
        return (
          <div key={key}>
            <label htmlFor={`contact-${key}`} className="label text-muted-foreground">
              {label}
            </label>
            {multiline ? (
              <textarea rows={5} {...shared} className={`${shared.className} resize-none`} />
            ) : (
              <input type={type} autoComplete={autoComplete} {...shared} />
            )}
            {error && (
              <p id={`contact-${key}-error`} className="mt-2 text-sm text-red-700 dark:text-red-400">
                {error}
              </p>
            )}
          </div>
        );
      })}

      <button
        type="submit"
        className="group inline-flex h-12 items-center justify-center gap-3 self-start rounded-full bg-accent px-6 font-medium text-accent-foreground transition-[filter] hover:brightness-110"
      >
        {sent ? (
          <>
            <Check className="h-4 w-4" aria-hidden="true" /> Opened in your mail app
          </>
        ) : (
          <>
            Send message
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </>
        )}
      </button>
      <p className="text-sm text-muted-foreground" role="status">
        {sent
          ? 'Your email app should now have the message ready — hit send there to reach me.'
          : 'Sending opens your email app with the message filled in, addressed to me.'}
      </p>
    </form>
  );
}
