import { describe, expect, it } from 'vitest';

import { DomainError } from '../../../shared/errors/domain-error';
import { DocumentDomainBuilder } from '../../documents-/test/document-.domain.builder';

import { createDocument, updateDocument } from './document';

describe('createDocument (domain)', () => {
  it('creates a document  and normalizes strings', () => {
    const input = new DocumentDomainBuilder()
      .withTitle('  OC policy  ')
      .withIssuer('   ')
      .withNote('  paid yearly  ')
      .withCreatedAt(undefined)
      .build();

    const document = createDocument(input);

    expect(document.title).toBe('OC policy');
    expect(document.issuer).toBeNull();
    expect(document.note).toBe('paid yearly');
    expect(document.cost).toBe(1299);
    expect(document.createdAt).toBeInstanceOf(Date);
  });

  it('rejects when validTo is before validFrom', () => {
    const input = new DocumentDomainBuilder()
      .withValidFrom(new Date('2025-12-31T00:00:00.000Z'))
      .withValidTo(new Date('2025-01-01T00:00:00.000Z'))
      .build();

    expect(() => createDocument(input)).toThrow(DomainError);
  });

  it('rejects when issuedAt is after validTo', () => {
    const input = new DocumentDomainBuilder()
      .withIssuedAt(new Date('2026-01-01T00:00:00.000Z'))
      .build();

    expect(() => createDocument(input)).toThrow(DomainError);
  });

  it('rejects when issuedAt is in the future', () => {
    const input = new DocumentDomainBuilder()
      .withIssuedAt(new Date(Date.now() + 24 * 60 * 60 * 1000))
      .build();

    expect(() => createDocument(input)).toThrow(DomainError);
  });

  it('rejects negative cost', () => {
    const input = new DocumentDomainBuilder().withCost(-1).build();

    expect(() => createDocument(input)).toThrow(DomainError);
  });
});

describe('updateDocument (domain)', () => {
  it('updates only provided fields and normalizes patch values', () => {
    const document = createDocument(new DocumentDomainBuilder().build());

    const updated = updateDocument(document, {
      title: '  Extended policy  ',
      issuer: '   ',
      note: '  paid monthly  ',
      cost: 1500,
    });

    expect(updated.id).toBe(document.id);
    expect(updated.vehicleId).toBe(document.vehicleId);
    expect(updated.ownerId).toBe(document.ownerId);
    expect(updated.type).toBe(document.type);
    expect(updated.title).toBe('Extended policy');
    expect(updated.issuer).toBeNull();
    expect(updated.note).toBe('paid monthly');
    expect(updated.cost).toBe(1500);
    expect(updated.validFrom).toEqual(document.validFrom);
    expect(updated.validTo).toEqual(document.validTo);
    expect(updated.createdAt).toEqual(document.createdAt);
  });

  it('rejects empty updated title after trim', () => {
    const document = createDocument(new DocumentDomainBuilder().build());

    expect(() =>
      updateDocument(document, {
        title: '   ',
      }),
    ).toThrow(DomainError);
  });

  it('rejects updated issuedAt after validTo', () => {
    const document = createDocument(new DocumentDomainBuilder().build());

    expect(() =>
      updateDocument(document, {
        issuedAt: new Date('2026-01-01T00:00:00.000Z'),
      }),
    ).toThrow(DomainError);
  });
});
