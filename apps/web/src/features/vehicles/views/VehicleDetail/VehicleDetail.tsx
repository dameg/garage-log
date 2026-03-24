import {
  Alert,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconCalendarStats,
  IconCar,
  IconGauge,
  IconHash,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { routes } from '@/app/routes';
import { useVehicle } from '../../hooks/useVehicle';

type VehicleDetailProps = {
  id: string;
};

type DetailStatProps = {
  label: string;
  value: string;
  description: string;
  icon: typeof IconCar;
};

type DetailRowProps = {
  label: string;
  value: string;
  hint?: string;
};

const yearFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

const mileageFormatter = new Intl.NumberFormat('en-US');

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
});

function getVehicleAgeLabel(year: number) {
  const age = Math.max(new Date().getFullYear() - year, 0);
  return age === 0 ? 'Current year model' : `${age} years on the road`;
}

function DetailStat({ label, value, description, icon: Icon }: DetailStatProps) {
  return (
    <Paper p="lg" radius="xl" withBorder>
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Box>
          <Text size="sm" c="dimmed">
            {label}
          </Text>
          <Text fz="xl" fw={700} mt={6}>
            {value}
          </Text>
          <Text size="sm" c="dimmed" mt="xs">
            {description}
          </Text>
        </Box>

        <ThemeIcon size={44} radius="xl" variant="light" color="blue">
          <Icon size={22} stroke={1.8} />
        </ThemeIcon>
      </Group>
    </Paper>
  );
}

function DetailRow({ label, value, hint }: DetailRowProps) {
  return (
    <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md">
      <Box>
        <Text size="sm" c="dimmed">
          {label}
        </Text>
        {hint ? (
          <Text size="xs" c="dimmed" mt={2}>
            {hint}
          </Text>
        ) : null}
      </Box>

      <Text ta="right" fw={600}>
        {value}
      </Text>
    </Group>
  );
}

export function VehicleDetail({ id }: VehicleDetailProps) {
  const navigate = useNavigate();
  const { data: vehicle, isLoading, isError } = useVehicle(id);

  if (isLoading) {
    return (
      <Center mih="70vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Container size="xl">
        <Alert icon={<IconInfoCircle size={16} />} color="red" radius="lg" title="Unable to load vehicle">
          Something went wrong while loading this vehicle.
        </Alert>
      </Container>
    );
  }

  if (!vehicle) {
    return (
      <Container size="xl">
        <Alert
          icon={<IconInfoCircle size={16} />}
          color="red"
          radius="lg"
          title="Vehicle not found"
        >
          The requested vehicle does not exist or is no longer available.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="lg">
      <Stack gap="xl">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          w="fit-content"
          px={0}
          onClick={() => navigate(routes.vehicles.build())}
        >
          Back to vehicles
        </Button>

        <Paper
          radius="2xl"
          p={{ base: 'lg', md: 'xl' }}
          style={{
            background:
              'linear-gradient(135deg, var(--mantine-color-blue-filled) 0%, var(--mantine-color-cyan-6) 100%)',
            color: 'white',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 32%)',
              pointerEvents: 'none',
            }}
          />

          <Grid align="stretch" gutter="xl" style={{ position: 'relative' }}>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="lg">
                <Group gap="sm">
                  <Badge color="rgba(255,255,255,0.18)" variant="filled" tt="uppercase">
                    Vehicle profile
                  </Badge>
                  <Badge color="rgba(255,255,255,0.18)" variant="filled">
                    {yearFormatter.format(vehicle.year)}
                  </Badge>
                </Group>

                <Stack gap={6}>
                  <Title order={1} fz={{ base: 30, md: 42 }} lh={1.05}>
                    {vehicle.brand} {vehicle.model}
                  </Title>
                  <Text size="lg" maw={640} c="rgba(255,255,255,0.82)">
                    A focused snapshot of the vehicle identity, mileage and registration details.
                  </Text>
                </Stack>

                <Group gap="md" wrap="wrap">
                  <Group gap="xs" wrap="nowrap">
                    <ThemeIcon size={34} radius="xl" color="rgba(255,255,255,0.16)" variant="filled">
                      <IconGauge size={18} stroke={1.8} />
                    </ThemeIcon>
                    <Text fw={600}>{mileageFormatter.format(vehicle.mileage)} km</Text>
                  </Group>

                  <Group gap="xs" wrap="nowrap">
                    <ThemeIcon size={34} radius="xl" color="rgba(255,255,255,0.16)" variant="filled">
                      <IconCalendarStats size={18} stroke={1.8} />
                    </ThemeIcon>
                    <Text fw={600}>{getVehicleAgeLabel(vehicle.year)}</Text>
                  </Group>
                </Group>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper
                p="lg"
                radius="xl"
                style={{
                  backgroundColor: 'rgba(8, 15, 33, 0.22)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Stack gap="md">
                  <Group justify="space-between" align="flex-start">
                    <Box>
                      <Text size="sm" c="rgba(255,255,255,0.72)">
                        VIN
                      </Text>
                      <Text fw={700} mt={4}>
                        {vehicle.vin}
                      </Text>
                    </Box>

                    <ThemeIcon size={42} radius="xl" color="rgba(255,255,255,0.16)" variant="filled">
                      <IconHash size={20} stroke={1.8} />
                    </ThemeIcon>
                  </Group>

                  <Divider color="rgba(255,255,255,0.14)" />

                  <Stack gap="xs">
                    <Text size="sm" c="rgba(255,255,255,0.72)">
                      Added to garage
                    </Text>
                    <Text fw={600}>{dateFormatter.format(new Date(vehicle.createdAt))}</Text>
                  </Stack>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Paper>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          <DetailStat
            label="Model year"
            value={yearFormatter.format(vehicle.year)}
            description={getVehicleAgeLabel(vehicle.year)}
            icon={IconCalendarStats}
          />
          <DetailStat
            label="Mileage"
            value={`${mileageFormatter.format(vehicle.mileage)} km`}
            description="Current odometer reading"
            icon={IconGauge}
          />
          <DetailStat
            label="Record created"
            value={dateFormatter.format(new Date(vehicle.createdAt))}
            description="Stored in your garage log"
            icon={IconCar}
          />
        </SimpleGrid>

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper p="xl" radius="xl" withBorder h="100%">
              <Stack gap="lg">
                <Box>
                  <Text size="sm" tt="uppercase" fw={700} c="blue">
                    Overview
                  </Text>
                  <Title order={3} mt={6}>
                    Core vehicle information
                  </Title>
                </Box>

                <Divider />

                <Stack gap="lg">
                  <DetailRow label="Brand" value={vehicle.brand} />
                  <DetailRow label="Model" value={vehicle.model} />
                  <DetailRow label="Production year" value={yearFormatter.format(vehicle.year)} />
                  <DetailRow
                    label="Mileage"
                    value={`${mileageFormatter.format(vehicle.mileage)} km`}
                    hint="Latest recorded odometer value"
                  />
                </Stack>
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper p="xl" radius="xl" withBorder h="100%">
              <Stack gap="lg">
                <Box>
                  <Text size="sm" tt="uppercase" fw={700} c="blue">
                    Identity
                  </Text>
                  <Title order={3} mt={6}>
                    Registry and ownership
                  </Title>
                </Box>

                <Divider />

                <Stack gap="lg">
                  <DetailRow label="VIN" value={vehicle.vin} hint="Vehicle identification number" />
                  <DetailRow label="Vehicle ID" value={vehicle.id} hint="Internal garage-log identifier" />
                  <DetailRow label="Owner ID" value={vehicle.ownerId} hint="Current linked account" />
                  <DetailRow
                    label="Created at"
                    value={dateFormatter.format(new Date(vehicle.createdAt))}
                    hint="Date this record was added"
                  />
                </Stack>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
