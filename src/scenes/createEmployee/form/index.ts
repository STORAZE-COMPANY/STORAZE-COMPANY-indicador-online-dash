import * as yup from "yup";
import { emailSchema, notEmptyString, phoneSchema } from "../../../shared/utils/validation";
import { ValidationMessages } from "../../../shared/enums/messages/validationsMessages";
import { ResponseMessages } from "../../../shared/enums/messages/responseMessages";

import { createEmployee } from "../requests";
import { useState } from "react";

export function useCreateEmployeeForm(){
const [formLoading, setFormLoading] = useState(false);
const initialValues: yup.InferType<typeof checkoutSchema> = { name: "", email: "", contact: "", company_id: 0 };

  const checkoutSchema = yup.object().shape({
    name: yup.string().required(ValidationMessages.nameRequired).test(ValidationMessages.nameRequired, ValidationMessages.nameRequired, notEmptyString
    ),
    company_id:yup.number().min(1).required(),
    email:emailSchema,
    contact: phoneSchema

  });
  
  const handleFormSubmit = async  (
    values: yup.InferType<typeof checkoutSchema>,
    actions: any,
    onError: (responseMessages:ResponseMessages) => void,
    onSuccess: (responseMessages:ResponseMessages) => void
  ) => {

    const {email,contact,name,company_id} = values;

  await createEmployee({
      email,
      name,
     phone:contact.replace(/[^0-9]/g, ''),
     company_id,
  
    },   
    onError,
 (responseMessages: ResponseMessages ) =>{
    onSuccess(responseMessages);
    actions.resetForm({
      values: initialValues 
    });
 },
 (loading) => setFormLoading(loading)
  )

  };
  
  return {
    initialValues,
    checkoutSchema,
    handleFormSubmit,
    formLoading
  };
}