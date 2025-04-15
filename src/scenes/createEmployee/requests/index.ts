
import { isAxiosError } from "axios";
import { getIndicadorOnlineAPI } from "../../../api/generated/api";
import { CreateEmployeeDto } from "../../../api/generated/api.schemas";
import { ResponseMessages } from "../../../shared/enums/messages/responseMessages";

const {employeesControllerCreate,companiesControllerFindAll} = getIndicadorOnlineAPI();


export const createEmployee = async (
  employee: CreateEmployeeDto,
  onError:(responseMessages:ResponseMessages)=>void,
  onSuccess:(responseMessages:ResponseMessages)=>void,
  loading:(boolean:boolean)=>void
) => {
  loading(true);
  try {
    const response = await employeesControllerCreate(employee);
  if(response){
    onSuccess(ResponseMessages.createSuccess);
  }
  } catch (error) {
    if(isAxiosError(error)){
      if(error.response?.status === 409){
        onError(ResponseMessages.conflictEmailError);
        return
      }
    }
    console.error("Error creating employee", error);
    onError(ResponseMessages.createError);
    throw error;
  }finally{
    loading(false);
  }
};

export const getCompanies = async () => { 
  try {
    const response = await companiesControllerFindAll();
    return response;
  } catch (error) {
  
    console.error(error);
    throw error;
  }
}