import { mutationOptions } from '@tanstack/react-query';
import { login, logout, register } from '../api';

export const authMutations = {
  login: () =>
    mutationOptions({
      mutationFn: login,
    }),
  register: () =>
    mutationOptions({
      mutationFn: register,
    }),
  logout: () =>
    mutationOptions({
      mutationFn: logout,
    }),
};
