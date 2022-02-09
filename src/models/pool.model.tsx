type CompanyType = {
  name: string;
};

export interface PoolType {
  id: string;
  receipt_date: string;
  run_title: string;
  title: string;
  company_id: string;
  company: CompanyType;
  rack_id: string;
  pool_id: string;
  result: string;
  pool_size: string;
  tube_ids: string[];
  resultIsUpdating: boolean;
  //TODO: CHECK NEXT TYPES
  is_published: boolean;
  isUpdating: boolean;
}
