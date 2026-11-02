export type ConfigurationCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

export type ConfigurationCustomerErrors = Partial<Record<keyof ConfigurationCustomer, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateConfigurationCustomer(
  customer: ConfigurationCustomer,
  messages: { required: string; invalidEmail: string },
) {
  const errors: ConfigurationCustomerErrors = {};
  if (!customer.firstName.trim()) errors.firstName = messages.required;
  if (!customer.lastName.trim()) errors.lastName = messages.required;
  if (!customer.email.trim()) errors.email = messages.required;
  else if (!EMAIL_PATTERN.test(customer.email.trim())) errors.email = messages.invalidEmail;
  return errors;
}
