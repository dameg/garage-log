import { useState } from 'react';
import { Card, Divider, Group, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCar } from '@tabler/icons-react';

import { AppLoader, EmptyState, ErrorAlert } from '@/shared/ui';

import type { Vehicle } from '@/entities/vehicle';

import { CreateVehicleAction } from '@/features/vehicle/create-vehicle';
import { DeleteVehicleDialog } from '@/features/vehicle/delete-vehicle';
import { UpdateVehicleDialog } from '@/features/vehicle/update-vehicle';

import { useVehiclesTableSearchParams } from '../model/useVehiclesTableSearchParams';
import { useVehiclesList } from '../model/useVehiclesList';
import { usePrefetchVehiclesTablePage } from '../model/usePrefetchVehiclesTablePage';
import { VehiclesFiltersForm } from './VehiclesFiltersForm';
import { VehiclesTable } from './VehiclesTable';

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
    data: vehicles = EMPTY_VEHICLES_LIST,
    isLoading,
    isFetching,
    isError,
  } = useVehiclesList(params);

  const totalItems = vehicles.total;
  const totalPages = Math.ceil(totalItems / pagination.pageSize);

  usePrefetchVehiclesTablePage({ params, pageIndex: pagination.pageIndex, totalPages });

  if (isLoading) {
    return <AppLoader />;
  }

  if (isError) {
    return (
      <ErrorAlert message="An error occurred while loading your vehicles. Please try again later." />
    );
  }

  if (!isLoading && !isError && vehicles.data.length === 0) {
    return (
      <EmptyState
        icon={<IconCar size={40} />}
        title="No vehicles yet"
        description="Add your first vehicle to start tracking everything."
        action={<CreateVehicleAction />}
      />
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
            data={vehicles.data}
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
