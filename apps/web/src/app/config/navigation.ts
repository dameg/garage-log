import type { FunctionComponent } from 'react';
import type { IconProps } from '@tabler/icons-react';
import { IconCar } from '@tabler/icons-react';
import { routes } from '../routes';

export type TablerIcon = FunctionComponent<IconProps>;

export type NavItem = {
  label: string;
  to: string;
  icon?: TablerIcon;
  end?: boolean;
};

export const navigation: NavItem[] = [
  {
    label: 'Vehicles',
    to: routes.vehicles.path,
    icon: IconCar,
  },
];
