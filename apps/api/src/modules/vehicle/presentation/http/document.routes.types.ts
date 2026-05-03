import type { createDocumentServices } from '../../document.services';

export type DocumentRoutesOptions = {
  services: ReturnType<typeof createDocumentServices>;
};
