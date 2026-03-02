export const routes = {
  dashboard: {
    path: "/",
    build: () => "/",
  },
  vehicles: {
    path: "/vehicles",
    build: () => "/vehicles",
    detail: {
      path: "/vehicles/:id",
      build: (id: string) => `/vehicles/${id}`,
    },
  },
} as const;
