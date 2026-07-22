import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  sendContactMessage,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from '@/utils/contact';

const initialValues: ContactFormValues = { name: '', email: '', subject: '', message: '' };

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleChange = (field: keyof ContactFormValues) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus('submitting');
    window.setTimeout(() => {
      sendContactMessage(values);
      setStatus('success');
      setValues(initialValues);
      window.setTimeout(() => setStatus('idle'), 4000);
    }, 600);
  };

  const fieldClasses = (hasError: boolean) =>
    `w-full rounded-lg border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-ring transition-colors ${
      hasError ? 'border-red-500' : 'border-border focus:border-primary/60'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={handleChange('name')}
            className={fieldClasses(!!errors.name)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            placeholder="Your name"
          />
          {errors.name ? (
            <p id="name-error" className="mt-1.5 text-xs text-red-500">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange('email')}
            className={fieldClasses(!!errors.email)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            placeholder="you@example.com"
          />
          {errors.email ? (
            <p id="email-error" className="mt-1.5 text-xs text-red-500">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-foreground">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={values.subject}
          onChange={handleChange('subject')}
          className={fieldClasses(!!errors.subject)}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
          placeholder="Let's build something great"
        />
        {errors.subject ? (
          <p id="subject-error" className="mt-1.5 text-xs text-red-500">
            {errors.subject}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={handleChange('message')}
          className={`${fieldClasses(!!errors.message)} resize-none`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          placeholder="Tell me about the role or project..."
        />
        {errors.message ? (
          <p id="message-error" className="mt-1.5 text-xs text-red-500">
            {errors.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" variant="primary" disabled={status === 'submitting'} className="w-full sm:w-fit">
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Opening your email client...
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Message ready to send
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Send Message
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground" role="status">
        {status === 'success'
          ? 'Your email app should have opened with the message prefilled — hit send there to reach me.'
          : 'Submitting opens your email client with this message prefilled, addressed to me directly.'}
      </p>
    </form>
  );
}
