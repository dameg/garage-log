import type { CreateDocumentBody } from '../presentation/validation/create-document.schema';

type DocumentHttpPayload = Omit<
  CreateDocumentBody,
  'validFrom' | 'validTo' | 'issuedAt'
> & {
  validFrom: string;
  validTo: string;
  issuedAt?: string;
};

export class DocumentHttpBuilder {
  private data: DocumentHttpPayload = {
    type: 'insurance',
    title: 'OC policy',
    issuer: 'PZU',
    validFrom: '2025-01-01T00:00:00.000Z',
    validTo: '2025-12-31T00:00:00.000Z',
    issuedAt: '2024-12-15T00:00:00.000Z',
    cost: 1299,
    note: 'Annual renewal',
  };

  withType(type: DocumentHttpPayload['type']) {
    this.data.type = type;
    return this;
  }

  withTitle(title: string) {
    this.data.title = title;
    return this;
  }

  withIssuer(issuer?: string) {
    if (issuer === undefined) {
      delete this.data.issuer;
      return this;
    }

    this.data.issuer = issuer;
    return this;
  }

  withValidFrom(validFrom: string) {
    this.data.validFrom = validFrom;
    return this;
  }

  withValidTo(validTo: string) {
    this.data.validTo = validTo;
    return this;
  }

  withIssuedAt(issuedAt?: string) {
    if (issuedAt === undefined) {
      delete this.data.issuedAt;
      return this;
    }

    this.data.issuedAt = issuedAt;
    return this;
  }

  withCost(cost?: number) {
    if (cost === undefined) {
      delete this.data.cost;
      return this;
    }

    this.data.cost = cost;
    return this;
  }

  withNote(note?: string) {
    if (note === undefined) {
      delete this.data.note;
      return this;
    }

    this.data.note = note;
    return this;
  }

  build() {
    return { ...this.data };
  }
}
