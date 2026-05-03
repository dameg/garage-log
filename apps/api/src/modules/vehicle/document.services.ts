import { CreateDocumentUseCase } from './application/create-document.usecase';
import { DeleteDocumentUseCase } from './application/delete-document.usecase';
import { GetDocumentUseCase } from './application/get-vehicle-document.usecase';
import { ListDocumentsUseCase } from './application/list-documents.usecase';
import { UpdateDocumentUseCase } from './application/update-document.usecase';
import type { DocumentRepository } from './contracts/document.repository';

type DocumentDeps = {
  repository: DocumentRepository;
};

export function createDocumentServices({ repository }: DocumentDeps) {
  return {
    createDocumentUseCase: new CreateDocumentUseCase(repository),
    listDocumentsUseCase: new ListDocumentsUseCase(repository),
    getDocumentUseCase: new GetDocumentUseCase(repository),
    deleteDocumentUseCase: new DeleteDocumentUseCase(repository),
    updateDocumentUseCase: new UpdateDocumentUseCase(repository),
  };
}
