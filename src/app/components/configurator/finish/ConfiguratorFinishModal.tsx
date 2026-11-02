import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useConfiguratorCopy } from "../copy";
import {
  validateConfigurationCustomer,
  type ConfigurationCustomer,
  type ConfigurationCustomerErrors,
} from "./finishValidation";

type ConfiguratorFinishModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (customer: ConfigurationCustomer) => Promise<unknown>;
};

const EMPTY_CUSTOMER: ConfigurationCustomer = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
};

export function ConfiguratorFinishModal({ open, onClose, onSubmit }: ConfiguratorFinishModalProps) {
  const { text } = useConfiguratorCopy();
  const [customer, setCustomer] = useState<ConfigurationCustomer>(EMPTY_CUSTOMER);
  const [errors, setErrors] = useState<ConfigurationCustomerErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [success, setSuccess] = useState(false);
  const submissionInFlight = useRef(false);

  useEffect(() => {
    if (!open) return;
    setCustomer(EMPTY_CUSTOMER);
    setErrors({});
    setSubmitting(false);
    setSubmitError(false);
    setSuccess(false);
    submissionInFlight.current = false;
  }, [open]);

  if (!open) return null;

  function updateField(field: keyof ConfigurationCustomer, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionInFlight.current) return;
    const nextErrors = validateConfigurationCustomer(customer, {
      required: text("finishRequired"),
      invalidEmail: text("finishInvalidEmail"),
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    submissionInFlight.current = true;
    setSubmitting(true);
    setSubmitError(false);
    try {
      await onSubmit(customer);
      setSuccess(true);
    } catch (error) {
      console.error("Configuration submission failed:", error);
      setSubmitError(true);
      submissionInFlight.current = false;
    } finally {
      setSubmitting(false);
    }
  }

  const modal = (
    <div className="asea-finish-backdrop" role="presentation">
      <section
        className="asea-finish-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="asea-finish-title"
      >
        {success ? (
          <div className="asea-finish-success" role="status">
            <span className="asea-finish-success-mark" aria-hidden="true">✓</span>
            <h2 id="asea-finish-title">{text("finishSuccessTitle")}</h2>
            <p>{text("finishSuccessText")}</p>
            <button type="button" className="asea-finish-primary" onClick={onClose}>
              {text("finishClose")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <h2 id="asea-finish-title">{text("finishModalTitle")}</h2>
            <p className="asea-finish-intro">{text("finishModalText")}</p>

            <div className="asea-finish-name-row">
              <FinishField
                id="asea-first-name"
                label={text("finishFirstName")}
                value={customer.firstName}
                error={errors.firstName}
                autoComplete="given-name"
                onChange={(value) => updateField("firstName", value)}
              />
              <FinishField
                id="asea-last-name"
                label={text("finishLastName")}
                value={customer.lastName}
                error={errors.lastName}
                autoComplete="family-name"
                onChange={(value) => updateField("lastName", value)}
              />
            </div>
            <FinishField
              id="asea-finish-email"
              label={text("finishEmail")}
              value={customer.email}
              error={errors.email}
              type="email"
              autoComplete="email"
              onChange={(value) => updateField("email", value)}
            />
            <label className="asea-finish-field" htmlFor="asea-finish-message">
              <span>{text("finishMessage")}</span>
              <textarea
                id="asea-finish-message"
                value={customer.message}
                rows={3}
                onChange={(event) => updateField("message", event.target.value)}
              />
            </label>

            {submitError ? <p className="asea-finish-submit-error" role="alert">{text("finishSendError")}</p> : null}
            {submitting ? <p className="asea-finish-progress" role="status">{text("finishCreating")}</p> : null}

            <div className="asea-finish-actions">
              <button type="button" className="asea-finish-secondary" disabled={submitting} onClick={onClose}>
                {text("finishBack")}
              </button>
              <button type="submit" className="asea-finish-primary" disabled={submitting}>
                {submitting ? text("finishCreating") : text("finishSubmit")}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );

  return createPortal(modal, document.body);
}

type FinishFieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  type?: "text" | "email";
  autoComplete: string;
  onChange: (value: string) => void;
};

function FinishField({
  id,
  label,
  value,
  error,
  type = "text",
  autoComplete,
  onChange,
}: FinishFieldProps) {
  const errorId = `${id}-error`;
  return (
    <label className="asea-finish-field" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <small id={errorId}>{error}</small> : null}
    </label>
  );
}
