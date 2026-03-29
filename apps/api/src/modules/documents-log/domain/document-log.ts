import { normalizeOptionalString } from '../../../shared/domain/normalize-optional-string';
import { normalizeRequiredString } from '../../../shared/domain/normalize-required-string';
import { DomainError } from '../../../shared/errors/domain-error';

export type DocumentLogId = string;

export const documentLogTypes = ['insurance', 'inspection'] as const;

export type DocumentLogType = (typeof documentLogTypes)[number];

export type DocumentLog = {
  id: DocumentLogId;
  vehicleId: string;
  ownerId: string;
  type: DocumentLogType;
  title: string;
  issuer: string | null;
  validFrom: Date;
  validTo: Date;
  issuedAt: Date | null;
  cost: number | null;
  note: string | null;
  createdAt: Date;
};

export type CreateDocumentLogProps = Omit<DocumentLog, 'createdAt'> & {
  createdAt?: Date;
};

export type UpdatableDocumentLogFields = Pick<
  DocumentLog,
  'type' | 'title' | 'issuer' | 'validFrom' | 'validTo' | 'issuedAt' | 'cost' | 'note'
>;

export type UpdateDocumentLogPatch = Partial<UpdatableDocumentLogFields>;

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

export function validateDocumentLogInvariant(documentLog: DocumentLog) {
  assertValidDateRange(documentLog.validFrom, documentLog.validTo);
  assertOptionalDateNotAfter(documentLog.issuedAt, documentLog.validTo, 'issuedAt');
  assertOptionalDateNotInFuture(documentLog.issuedAt, 'issuedAt');
}

export function createDocumentLog(props: CreateDocumentLogProps): DocumentLog {
  const title = normalizeRequiredString('Document log title', props.title);
  const issuer = normalizeOptionalString(props.issuer);
  const validFrom = normalizeRequiredDate('validFrom', props.validFrom);
  const validTo = normalizeRequiredDate('validTo', props.validTo);
  const issuedAt = normalizeOptionalDate('issuedAt', props.issuedAt);
  const cost = normalizeOptionalNonNegativeCost(props.cost);
  const note = normalizeOptionalString(props.note);

  const documentLog = {
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

  validateDocumentLogInvariant(documentLog);

  return documentLog;
}

export function updateDocumentLog(documentLog: DocumentLog, patch: UpdateDocumentLogPatch) {
  const next: DocumentLog = { ...documentLog, ...patch };

  if (patch.title !== undefined) {
    next.title = normalizeRequiredString('Document log title', next.title);
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

  validateDocumentLogInvariant(next);

  return next;
}
