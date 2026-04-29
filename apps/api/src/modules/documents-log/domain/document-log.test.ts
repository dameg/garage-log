import { describe, expect, it } from 'vitest';

import { DomainError } from '../../../shared/errors/domain-error';
import { DocumentLogDomainBuilder } from '../test/document-log.domain.builder';

import { createDocumentLog, updateDocumentLog } from './document-log';

describe('createDocumentLog (domain)', () => {
  it('creates a document log and normalizes strings', () => {
    const input = new DocumentLogDomainBuilder()
      .withTitle('  OC policy  ')
      .withIssuer('   ')
      .withNote('  paid yearly  ')
      .withCreatedAt(undefined)
      .build();

    const documentLog = createDocumentLog(input);

    expect(documentLog.title).toBe('OC policy');
    expect(documentLog.issuer).toBeNull();
    expect(documentLog.note).toBe('paid yearly');
    expect(documentLog.cost).toBe(1299);
    expect(documentLog.createdAt).toBeInstanceOf(Date);
  });

  it('rejects when validTo is before validFrom', () => {
    const input = new DocumentLogDomainBuilder()
      .withValidFrom(new Date('2025-12-31T00:00:00.000Z'))
      .withValidTo(new Date('2025-01-01T00:00:00.000Z'))
      .build();

    expect(() => createDocumentLog(input)).toThrow(DomainError);
  });

  it('rejects when issuedAt is after validTo', () => {
    const input = new DocumentLogDomainBuilder()
      .withIssuedAt(new Date('2026-01-01T00:00:00.000Z'))
      .build();

    expect(() => createDocumentLog(input)).toThrow(DomainError);
  });

  it('rejects when issuedAt is in the future', () => {
    const input = new DocumentLogDomainBuilder()
      .withIssuedAt(new Date(Date.now() + 24 * 60 * 60 * 1000))
      .build();

    expect(() => createDocumentLog(input)).toThrow(DomainError);
  });

  it('rejects negative cost', () => {
    const input = new DocumentLogDomainBuilder().withCost(-1).build();

    expect(() => createDocumentLog(input)).toThrow(DomainError);
  });
});

describe('updateDocumentLog (domain)', () => {
  it('updates only provided fields and normalizes patch values', () => {
    const documentLog = createDocumentLog(new DocumentLogDomainBuilder().build());

    const updated = updateDocumentLog(documentLog, {
      title: '  Extended policy  ',
      issuer: '   ',
      note: '  paid monthly  ',
      cost: 1500,
    });

    expect(updated.id).toBe(documentLog.id);
    expect(updated.vehicleId).toBe(documentLog.vehicleId);
    expect(updated.ownerId).toBe(documentLog.ownerId);
    expect(updated.type).toBe(documentLog.type);
    expect(updated.title).toBe('Extended policy');
    expect(updated.issuer).toBeNull();
    expect(updated.note).toBe('paid monthly');
    expect(updated.cost).toBe(1500);
    expect(updated.validFrom).toEqual(documentLog.validFrom);
    expect(updated.validTo).toEqual(documentLog.validTo);
    expect(updated.createdAt).toEqual(documentLog.createdAt);
  });

  it('rejects empty updated title after trim', () => {
    const documentLog = createDocumentLog(new DocumentLogDomainBuilder().build());

    expect(() =>
      updateDocumentLog(documentLog, {
        title: '   ',
      }),
    ).toThrow(DomainError);
  });

  it('rejects updated issuedAt after validTo', () => {
    const documentLog = createDocumentLog(new DocumentLogDomainBuilder().build());

    expect(() =>
      updateDocumentLog(documentLog, {
        issuedAt: new Date('2026-01-01T00:00:00.000Z'),
      }),
    ).toThrow(DomainError);
  });
});
