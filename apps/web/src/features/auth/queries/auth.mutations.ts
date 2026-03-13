import { mutationOptions } from '@tanstack/react-query';
import { login, register } from '../api';

export const authMutations = {
  login: () =>
    mutationOptions({
      mutationFn: login,
    }),
  register: () =>
    mutationOptions({
      mutationFn: register,
    }),
};
