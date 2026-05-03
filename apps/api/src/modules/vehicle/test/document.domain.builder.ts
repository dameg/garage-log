import { randomUUID } from 'node:crypto';

import type { CreateDocumentProps, DocumentType } from '../domain/document';

export class DocumentDomainBuilder {
  private data: CreateDocumentProps = {
    id: randomUUID(),
    vehicleId: randomUUID(),
    ownerId: randomUUID(),
    type: 'insurance',
    title: 'OC policy',
    issuer: 'PZU',
    validFrom: new Date('2025-01-01T00:00:00.000Z'),
    validTo: new Date('2025-12-31T00:00:00.000Z'),
    issuedAt: new Date('2024-12-15T00:00:00.000Z'),
    cost: 1299,
    note: 'Annual renewal',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
  };

  withId(id: string) {
    this.data.id = id;
    return this;
  }

  withVehicleId(vehicleId: string) {
    this.data.vehicleId = vehicleId;
    return this;
  }

  withOwnerId(ownerId: string) {
    this.data.ownerId = ownerId;
    return this;
  }

  withType(type: DocumentType) {
    this.data.type = type;
    return this;
  }

  withTitle(title: string) {
    this.data.title = title;
    return this;
  }

  withIssuer(issuer: string | null) {
    this.data.issuer = issuer;
    return this;
  }

  withValidFrom(validFrom: Date) {
    this.data.validFrom = validFrom;
    return this;
  }

  withValidTo(validTo: Date) {
    this.data.validTo = validTo;
    return this;
  }

  withIssuedAt(issuedAt: Date | null) {
    this.data.issuedAt = issuedAt;
    return this;
  }

  withCost(cost: number | null) {
    this.data.cost = cost;
    return this;
  }

  withNote(note: string | null) {
    this.data.note = note;
    return this;
  }

  withCreatedAt(createdAt: Date | undefined) {
    this.data.createdAt = createdAt;
    return this;
  }

  build() {
    return { ...this.data };
  }
}
