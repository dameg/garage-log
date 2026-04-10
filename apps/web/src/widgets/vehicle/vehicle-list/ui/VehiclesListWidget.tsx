import { useMemo, useState } from 'react';
import {
  Alert,
  Card,
  Center,
  Container,
  Divider,
  Group,
  Loader,
  Stack,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconInfoCircle } from '@tabler/icons-react';

import type { Vehicle } from '@/entities/vehicle';
import { useVehiclesTableSearchParams } from '../model/useVehiclesTableSearchParams';
import { useVehiclesList } from '../model/useVehiclesList';
import { usePrefetchVehiclesTablePage } from '../model/usePrefetchVehiclesTablePage';
import { VehiclesFiltersForm } from './VehiclesFiltersForm';
import { VehiclesTable } from './VehiclesTable';
import { CreateVehicleAction } from '@/features/vehicle/create-vehicle';
import { DeleteVehicleDialog } from '@/features/vehicle/delete-vehicle';
import { UpdateVehicleDialog } from '@/features/vehicle/update-vehicle';

const EMPTY_VEHICLES_LIST = {
  data: [],
  total: 0,
};

export function VehiclesListWidget() {
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
  const [editDialogOpened, { open: openEditDialog, close: closeEditDialog }] = useDisclosure(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [deleteDialogOpened, { open: openDeleteDialog, close: closeDeleteDialog }] =
    useDisclosure(false);

  const {
    params,
    filters,
    pagination,
    sorting,
    setFilters,
    resetFilters,
    setPagination,
    setSorting,
  } = useVehiclesTableSearchParams();

  const {
    data: vehiclesResponse = EMPTY_VEHICLES_LIST,
    isLoading,
    isFetching,
    isError,
  } = useVehiclesList(params);

  const data = vehiclesResponse.data;
  const totalItems = vehiclesResponse.total;
  const totalPages = Math.ceil(totalItems / pagination.pageSize);

  usePrefetchVehiclesTablePage({ params, pageIndex: pagination.pageIndex, totalPages });

  const filterInitialValues = useMemo(
    () => ({
      search: filters.search,
      yearFrom: filters.yearFrom,
      yearTo: filters.yearTo,
      mileageFrom: filters.mileageFrom,
      mileageTo: filters.mileageTo,
    }),
    [filters.search, filters.yearFrom, filters.yearTo, filters.mileageFrom, filters.mileageTo],
  );

  if (isLoading && !vehiclesResponse) {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return (
      <Container size="xl">
        <Alert
          icon={<IconInfoCircle size={16} />}
          color="red"
          radius="lg"
          title="Unable to load vehicles"
        >
          Something went wrong while loading vehicles.
        </Alert>
      </Container>
    );
  }

  const handleOpenDeleteDialog = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    openDeleteDialog();
  };

  const handleCloseDeleteDialog = () => {
    closeDeleteDialog();
  };

  const handleDeleteDialogExited = () => {
    setVehicleToDelete(null);
  };

  const handleOpenEditDialog = (vehicle: Vehicle) => {
    setVehicleToEdit(vehicle);
    openEditDialog();
  };

  const handleCloseEditDialog = () => {
    closeEditDialog();
  };

  const handleEditDialogExited = () => {
    setVehicleToEdit(null);
  };

  return (
    <>
      <Stack gap="xl">
        <Group justify="space-between" align="center" gap="md" wrap="wrap">
          <Title order={3}>Vehicles</Title>
          <CreateVehicleAction />
        </Group>
        <Divider />
        <Card shadow="sm" padding="lg" radius="lg" withBorder>
          <VehiclesFiltersForm filters={filters} onSubmit={setFilters} onReset={resetFilters} />
        </Card>
        <Card shadow="sm" padding="lg" radius="lg" withBorder>
          <VehiclesTable
            data={data}
            totalItems={totalItems}
            totalPages={totalPages}
            pagination={pagination}
            sorting={sorting}
            setPagination={setPagination}
            setSorting={setSorting}
            isFetching={isFetching}
            onDelete={handleOpenDeleteDialog}
            onEdit={handleOpenEditDialog}
          />
        </Card>
      </Stack>

      <DeleteVehicleDialog
        opened={deleteDialogOpened}
        onClose={handleCloseDeleteDialog}
        onExited={handleDeleteDialogExited}
        vehicle={vehicleToDelete}
      />
      <UpdateVehicleDialog
        opened={editDialogOpened}
        onClose={handleCloseEditDialog}
        onExited={handleEditDialogExited}
        vehicle={vehicleToEdit}
      />
    </>
  );
}
