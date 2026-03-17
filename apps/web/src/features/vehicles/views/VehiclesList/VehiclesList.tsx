import { useMemo, useState } from 'react';
import { Button, Center, Divider, Group, Loader, Modal, Text, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

import { useCreateVehicle } from '../../hooks/useCreateVehicle';
import { usePrefetchVehiclesTablePage } from '../../hooks/usePrefetchVehiclesTablePage';
import { useUpdateVehicle } from '../../hooks/useUpdateVehicle';
import { useVehicles } from '../../hooks/useVehicles';
import { useVehiclesFiltersSearchParams } from '../../hooks/useVehiclesFiltersSearchParams';
import { useVehiclesTextSearch } from '../../hooks/useVehiclesTextSearch';
import { useVehiclesTableSearchParams } from '../../hooks/useVehiclesTableSearchParams';
import type { CreateVehicleInput, Vehicle, VehicleRangeFilters } from '../../types';
import { VehicleForm } from '../../ui/VehicleForm';
import { VehiclesFilters } from '../../ui/VehiclesFilters';
import { VehiclesTable } from '../../ui/VehiclesTable';

type VehicleFormState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; vehicle: Vehicle };

function getVehicleFiltersFormKey(filters: VehicleRangeFilters) {
  return [filters.yearFrom, filters.yearTo, filters.mileageFrom, filters.mileageTo]
    .map((value) => value ?? '')
    .join(':');
}

export function VehiclesList() {
  const [formState, setFormState] = useState<VehicleFormState>({
    mode: 'closed',
  });

  const openCreateModal = () => {
    setFormState({ mode: 'create' });
  };

  const openEditModal = (vehicle: Vehicle) => {
    setFormState({ mode: 'edit', vehicle });
  };

  const closeFormModal = () => {
    setFormState({ mode: 'closed' });
  };

  const {
    params: tableParams,
    pagination,
    sorting,
    setPagination,
    setSorting,
  } = useVehiclesTableSearchParams();

  const { filters, setSearch, setRangeFilters, resetFilters } = useVehiclesFiltersSearchParams();

  const { searchInput, onSearchChange, resetSearch } = useVehiclesTextSearch(
    filters.search,
    setSearch,
  );

  const params = useMemo(
    () => ({
      ...tableParams,
      ...filters,
    }),
    [tableParams, filters],
  );

  const filterInitialValues = useMemo(
    () => ({
      yearFrom: filters.yearFrom,
      yearTo: filters.yearTo,
      mileageFrom: filters.mileageFrom,
      mileageTo: filters.mileageTo,
    }),
    [filters.yearFrom, filters.yearTo, filters.mileageFrom, filters.mileageTo],
  );
  const filtersFormKey = getVehicleFiltersFormKey(filterInitialValues);

  const createVehicleMutation = useCreateVehicle(params);
  const updateVehicleMutation = useUpdateVehicle(params);
  const isFormModalOpen = formState.mode !== 'closed';
  const formModalTitle =
    formState.mode === 'create'
      ? 'Create vehicle'
      : formState.mode === 'edit'
        ? 'Edit vehicle'
        : undefined;

  const handleSubmitVehicle = async (values: CreateVehicleInput) => {
    if (formState.mode === 'create') {
      await createVehicleMutation.mutateAsync(values);
      closeFormModal();
      return;
    }

    if (formState.mode === 'edit' && formState.vehicle) {
      await updateVehicleMutation.mutateAsync({
        id: formState.vehicle.id,
        payload: values,
      });
      closeFormModal();
    }
  };

  const query = useVehicles(params);

  const data = query.data?.data ?? [];
  const totalItems = query.data?.total ?? 0;
  const totalPages = Math.ceil(totalItems / pagination.pageSize);

  usePrefetchVehiclesTablePage({
    params,
    pageIndex: pagination.pageIndex,
    totalPages,
  });

  if (query.isLoading && !query.data) {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }

  if (query.isError) {
    return <Text c="red">Failed to load vehicles</Text>;
  }

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={3}>Vehicles</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreateModal}>
          Create vehicle
        </Button>
      </Group>

      <Divider my="md" />

      <VehiclesFilters
        key={filtersFormKey}
        searchInput={searchInput}
        onSearchChange={onSearchChange}
        initialValues={filterInitialValues}
        onSubmit={setRangeFilters}
        onReset={() => {
          resetSearch();
          resetFilters();
        }}
      />

      <Divider my="md" />

      <VehiclesTable
        data={data}
        totalItems={totalItems}
        totalPages={totalPages}
        pagination={pagination}
        sorting={sorting}
        setPagination={setPagination}
        setSorting={setSorting}
        isFetching={query.isFetching}
        onDelete={() => console.log('Delete')}
        onEdit={openEditModal}
      />

      <Modal
        opened={isFormModalOpen}
        onClose={closeFormModal}
        title={formModalTitle}
        centered
      >
        {isFormModalOpen ? (
          <VehicleForm
            key={formState.mode === 'edit' ? formState.vehicle.id : 'create-vehicle'}
            mode={formState.mode}
            vehicle={formState.mode === 'edit' ? formState.vehicle : null}
            isSubmitting={createVehicleMutation.isPending || updateVehicleMutation.isPending}
            onSubmit={handleSubmitVehicle}
            onClose={closeFormModal}
          />
        ) : null}
      </Modal>
    </>
  );
}
