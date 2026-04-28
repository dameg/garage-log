import {
  Box,
  Container,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconCalendarStats, IconGauge, IconNumber } from '@tabler/icons-react';

import type { Vehicle } from '@/entities/vehicle';

import { DeleteVehicleAction } from '@/features/vehicle/delete-vehicle';
import { UpdateVehicleAction } from '@/features/vehicle/update-vehicle';

type Props = {
  vehicle: Vehicle;
};

export function VehicleDetail({ vehicle }: Props) {
  return (
    <Container size="xl" py="lg">
      <Stack gap="xl">
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', sm: 'center' }}
          gap="md"
        >
          <Title order={1}>
            {vehicle.brand} {vehicle.model}
          </Title>
          <Flex direction={{ base: 'column', xs: 'row' }} gap="sm">
            <DeleteVehicleAction vehicle={vehicle} />
            <UpdateVehicleAction vehicle={vehicle} />
          </Flex>
        </Flex>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          <Paper p="lg" radius="lg" withBorder>
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Box>
                <Text size="sm" c="dimmed">
                  Model year
                </Text>
                <Text fz="xl" fw={700} mt={6}>
                  {vehicle.year}
                </Text>
              </Box>

              <ThemeIcon size={40} radius="lg" variant="light" color="blue">
                <IconCalendarStats size={22} stroke={1.8} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper p="lg" radius="lg" withBorder>
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Box>
                <Text size="sm" c="dimmed">
                  Mileage
                </Text>
                <Text fz="xl" fw={700} mt={6}>
                  {`${vehicle.mileage.toLocaleString()} km`}
                </Text>
              </Box>

              <ThemeIcon size={40} radius="lg" variant="light" color="blue">
                <IconGauge size={22} stroke={1.8} />
              </ThemeIcon>
            </Group>
          </Paper>
          <Paper p="lg" radius="lg" withBorder>
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Box>
                <Text size="sm" c="dimmed">
                  VIN
                </Text>
                <Text fz="xl" fw={700} mt={6}>
                  {vehicle.vin}
                </Text>
              </Box>

              <ThemeIcon size={40} radius="lg" variant="light" color="blue">
                <IconNumber size={22} stroke={1.8} />
              </ThemeIcon>
            </Group>
          </Paper>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
