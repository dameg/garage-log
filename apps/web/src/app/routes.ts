export const routes = {
  login: {
    path: '/login',
    build: () => '/login',
  },
  register: {
    path: '/register',
    build: () => '/register',
  },
  vehicles: {
    path: '/vehicles',
    build: () => '/vehicles',
    detail: {
      path: '/vehicles/:id',
      build: (id: string) => `/vehicles/${id}`,
    },
  },
} as const;
