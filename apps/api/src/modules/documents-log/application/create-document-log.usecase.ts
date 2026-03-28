import { randomUUID } from 'node:crypto';
import { DocumentLog } from '../domain/document-log';
import { DocumentLogRepository } from '../domain/document-log.repository';
import { CreateDocumentLogInput } from './dto/create-document-log.dto';

export class CreateDocumentLogUseCase {
  constructor(private readonly repo: DocumentLogRepository) {}

  async execute(input: CreateDocumentLogInput): Promise<DocumentLog> {
    const documentLog = {
      id: randomUUID(),
      ...input,
    };
    return this.repo.create(documentLog);
  }
}
