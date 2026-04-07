// import {
//   Alert,
//   Box,
//   Button,
//   Center,
//   Container,
//   Group,
//   Loader,
//   Paper,
//   SimpleGrid,
//   Stack,
//   Text,
//   ThemeIcon,
//   Title,
// } from '@mantine/core';
// import {
//   IconArrowLeft,
//   IconCalendarStats,
//   IconCar,
//   IconGauge,
//   IconInfoCircle,
// } from '@tabler/icons-react';
// import { useNavigate } from 'react-router-dom';

// import { routes } from '@/app/routes';
// import { useVehicle } from '@/entities/vehicle/hooks/useVehicle';

// import { VehicleDocumentLogs } from '../../ui/VehicleDocumentLogs/VehicleDocumentLogs';

// type VehicleDetailProps = {
//   vehicleId: string;
// };

// type DetailStatProps = {
//   label: string;
//   value: string | number;
//   description: string;
//   icon: typeof IconCar;
// };

// const dateFormatter = new Intl.DateTimeFormat('en-US', {
//   dateStyle: 'long',
// });

// function getVehicleAgeLabel(year: number) {
//   const age = Math.max(new Date().getFullYear() - year, 0);
//   return age === 0 ? 'Current year model' : `${age} years on the road`;
// }

// function DetailStat({ label, value, description, icon: Icon }: DetailStatProps) {
//   return (
//     <Paper p="lg" radius="lg" withBorder>
//       <Group justify="space-between" align="flex-start" wrap="nowrap">
//         <Box>
//           <Text size="sm" c="dimmed">
//             {label}
//           </Text>
//           <Text fz="xl" fw={700} mt={6}>
//             {value}
//           </Text>
//           <Text size="sm" c="dimmed" mt="xs">
//             {description}
//           </Text>
//         </Box>

//         <ThemeIcon size={40} radius="lg" variant="light" color="blue">
//           <Icon size={22} stroke={1.8} />
//         </ThemeIcon>
//       </Group>
//     </Paper>
//   );
// }

// export function VehicleDetail({ vehicleId }: VehicleDetailProps) {
//   const navigate = useNavigate();
//   const { data: vehicle, isLoading, isError } = useVehicle(vehicleId);

//   if (isLoading) {
//     return (
//       <Center mih="70vh">
//         <Loader size="lg" />
//       </Center>
//     );
//   }

//   if (isError) {
//     return (
//       <Container size="xl">
//         <Alert
//           icon={<IconInfoCircle size={16} />}
//           color="red"
//           radius="lg"
//           title="Unable to load vehicle"
//         >
//           Something went wrong while loading this vehicle.
//         </Alert>
//       </Container>
//     );
//   }

//   if (!vehicle) {
//     return (
//       <Container size="xl">
//         <Alert
//           icon={<IconInfoCircle size={16} />}
//           color="red"
//           radius="lg"
//           title="Vehicle not found"
//         >
//           The requested vehicle does not exist or is no longer available.
//         </Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container size="xl" py="lg">
//       <Stack gap="xl">
//         <Button
//           variant="subtle"
//           leftSection={<IconArrowLeft size={16} />}
//           w="fit-content"
//           px={0}
//           onClick={() => navigate(routes.vehicles.build())}
//         >
//           Back to vehicles
//         </Button>

//         <Stack gap="xs">
//           <Title order={1}>
//             {vehicle.brand} {vehicle.model}
//           </Title>
//         </Stack>

//         <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
//           <DetailStat
//             label="Model year"
//             value={vehicle.year}
//             description={getVehicleAgeLabel(vehicle.year)}
//             icon={IconCalendarStats}
//           />
//           <DetailStat
//             label="Mileage"
//             value={`${vehicle.mileage} km`}
//             description="Current odometer reading"
//             icon={IconGauge}
//           />
//           <DetailStat
//             label="Record created"
//             value={dateFormatter.format(new Date(vehicle.createdAt))}
//             description="Stored in your garage log"
//             icon={IconCar}
//           />
//         </SimpleGrid>
//       </Stack>
//       <VehicleDocumentLogs vehicleId={vehicle.id} />
//     </Container>
//   );
// }
