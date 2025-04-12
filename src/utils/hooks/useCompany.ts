
import { useUserDataStore } from '../../stores/UserDataStore';
import { useQuery } from '@tanstack/react-query';
import { getCompanyDataById } from '../services/companyRest.service';

const useCompany = () => {
    const { selectors: { getUserCompaniesSelector: companies } } = useUserDataStore()
    
    const companyId = companies[0]

    const { data: companyData, isPending: isCompanyDataPending, error: companyDataFetchError } = useQuery({
        queryFn: () => getCompanyDataById(companyId),
        queryKey: ["company", companyId]
    })
    
    return {
        companyData,
        isCompanyDataPending,
        companyDataFetchError
    }
};

export default useCompany;