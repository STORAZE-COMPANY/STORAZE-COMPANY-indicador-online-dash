import * as yup from "yup";
import { ValidationMessages } from "../../enums/messages/validationsMessages";

 const phoneRegexValidation =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
  
 const notEmptyString = (value: string) => !!value?.trim();

const emailSchema = yup.string().email(ValidationMessages.emailInvalid).required(ValidationMessages.emailRequired)
const phoneSchema = yup.string().matches(phoneRegexValidation, ValidationMessages.phoneInvalid).required(ValidationMessages.phoneRequired)  

export { phoneRegexValidation, notEmptyString, emailSchema ,phoneSchema};