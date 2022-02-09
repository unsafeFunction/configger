export type ResponseType<T> = {
  isLoading?: boolean;
  total?: number;
  offset?: number;
  error?: string | null;
  items: T[];
};
