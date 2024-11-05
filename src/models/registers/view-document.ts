import { TDocument } from "..";

export interface TViewDocuments {
  data: TDocument | undefined;
  currentPage: number;
  pageTotal: number;
  initing: boolean;
  setCurrentPage: (page: number) => void;
  onDocumentLoadSuccess: (data: { numPages: number }) => void;
  items: any[];
}
