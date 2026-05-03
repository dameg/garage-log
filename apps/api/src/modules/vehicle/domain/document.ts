import { normalizeOptionalString, normalizeRequiredString } from '@/shared/domain';
import { DomainError } from '@/shared/errors';

export type DocumentId = string;

export const documentTypes = ['insurance', 'inspection'] as const;

export type DocumentType = (typeof documentTypes)[number];

export type Document = {
  id: DocumentId;
  vehicleId: string;
  ownerId: string;
  type: DocumentType;
  title: string;
  issuer: string | null;
  validFrom: Date;
  validTo: Date;
  issuedAt: Date | null;
  cost: number | null;
  note: string | null;
  createdAt: Date;
};

export type CreateDocumentProps = Omit<Document, 'createdAt'> & {
  createdAt?: Date;
};

export type UpdatableDocumentFields = Pick<
  Document,
  'type' | 'title' | 'issuer' | 'validFrom' | 'validTo' | 'issuedAt' | 'cost' | 'note'
>;

export type UpdateDocumentPatch = Partial<UpdatableDocumentFields>;

export function normalizeRequiredDate(fieldName: string, value: Date): Date {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new DomainError(`${fieldName} must be a valid date`);
  }

  return value;
}

export function assertValidDateRange(from: Date, to: Date): void {
  if (to < from) {
    throw new DomainError('validTo must be greater than or equal to validFrom');
  }
}

export function assertOptionalDateNotInFuture(value: Date | null, fieldName = 'date'): void {
  if (value && value > new Date()) {
    throw new DomainError(`${fieldName} cannot be in the future`);
  }
}

export function assertOptionalDateNotAfter(
  value: Date | null,
  max: Date,
  fieldName = 'date',
): void {
  if (value && value > max) {
    throw new DomainError(`${fieldName} cannot be after allowed date`);
  }
}

export function normalizeOptionalDate(fieldName: string, value?: Date | null): Date | null {
  if (value == null) return null;

  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new DomainError(`${fieldName} must be a valid date`);
  }

  return value;
}

export function normalizeOptionalNonNegativeCost(value?: number | null): number | null {
  if (value == null) return null;

  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new DomainError('Cost must be a valid number');
  }

  if (value < 0) {
    throw new DomainError('Cost cannot be negative');
  }

  return value;
}

export function validateDocumentInvariant(document: Document) {
  assertValidDateRange(document.validFrom, document.validTo);
  assertOptionalDateNotAfter(document.issuedAt, document.validTo, 'issuedAt');
  assertOptionalDateNotInFuture(document.issuedAt, 'issuedAt');
}

export function createDocument(props: CreateDocumentProps): Document {
  const title = normalizeRequiredString('Document title', props.title);
  const issuer = normalizeOptionalString(props.issuer);
  const validFrom = normalizeRequiredDate('validFrom', props.validFrom);
  const validTo = normalizeRequiredDate('validTo', props.validTo);
  const issuedAt = normalizeOptionalDate('issuedAt', props.issuedAt);
  const cost = normalizeOptionalNonNegativeCost(props.cost);
  const note = normalizeOptionalString(props.note);

  const document = {
    id: props.id,
    vehicleId: props.vehicleId,
    ownerId: props.ownerId,
    type: props.type,
    title,
    issuer,
    validFrom,
    validTo,
    issuedAt,
    cost,
    note,
    createdAt: props.createdAt ?? new Date(),
  };

  validateDocumentInvariant(document);

  return document;
}

export function updateDocument(document: Document, patch: UpdateDocumentPatch) {
  const next: Document = { ...document, ...patch };

  if (patch.title !== undefined) {
    next.title = normalizeRequiredString('Document title', next.title);
  }

  if (patch.issuer !== undefined) {
    next.issuer = normalizeOptionalString(next.issuer);
  }

  if (patch.validFrom !== undefined) {
    next.validFrom = normalizeRequiredDate('validFrom', next.validFrom);
  }

  if (patch.validTo !== undefined) {
    next.validTo = normalizeRequiredDate('validTo', next.validTo);
  }

  if (patch.issuedAt !== undefined) {
    next.issuedAt = normalizeOptionalDate('issuedAt', next.issuedAt);
  }

  if (patch.cost !== undefined) {
    next.cost = normalizeOptionalNonNegativeCost(next.cost);
  }

  if (patch.note !== undefined) {
    next.note = normalizeOptionalString(next.note);
  }

  validateDocumentInvariant(next);

  return next;
}
