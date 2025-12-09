export interface Category {
  id: number | null;
  name: string;
  /** Backend always returns "simple" for now, but we keep it generic */
  type: string;
}
