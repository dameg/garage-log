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
import { useDeleteVehicle } from '../../hooks/useDeleteVehicle';

type VehicleModalState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; vehicle: Vehicle }
  | { mode: 'delete'; vehicle: Vehicle };

function getVehicleFiltersFormKey(filters: VehicleRangeFilters) {
  return [filters.yearFrom, filters.yearTo, filters.mileageFrom, filters.mileageTo]
    .map((value) => value ?? '')
    .join(':');
}

export function VehiclesList() {
  const [modalState, setModalState] = useState<VehicleModalState>({
    mode: 'closed',
  });

  const openCreateModal = () => {
    setModalState({ mode: 'create' });
  };

  const openEditModal = (vehicle: Vehicle) => {
    setModalState({ mode: 'edit', vehicle });
  };

  const openDeleteModal = (vehicle: Vehicle) => {
    setModalState({ mode: 'delete', vehicle });
  };

  const closeModal = () => {
    setModalState({ mode: 'closed' });
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
  const deleteVehicleMutation = useDeleteVehicle(params);

  const isEditorModalOpen = modalState.mode == 'edit' || modalState.mode == 'create';

  const editorModalTitle =
    modalState.mode === 'create'
      ? 'Create vehicle'
      : modalState.mode === 'edit'
        ? 'Edit vehicle'
        : undefined;

  const isDeleteModalOpen = modalState.mode === 'delete';
  const deleteTarget = modalState.mode === 'delete' ? modalState.vehicle : null;

  const handleSubmitVehicle = async (values: CreateVehicleInput) => {
    if (modalState.mode === 'create') {
      await createVehicleMutation.mutateAsync(values);
      closeModal();
      return;
    }

    if (modalState.mode === 'edit' && modalState.vehicle) {
      await updateVehicleMutation.mutateAsync({
        id: modalState.vehicle.id,
        payload: values,
      });
      closeModal();
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    await deleteVehicleMutation.mutateAsync(deleteTarget.id);
    closeModal();
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

      <Divider mb="md" />

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

      <VehiclesTable
        data={data}
        totalItems={totalItems}
        totalPages={totalPages}
        pagination={pagination}
        sorting={sorting}
        setPagination={setPagination}
        setSorting={setSorting}
        isFetching={query.isFetching}
        onDelete={openDeleteModal}
        onEdit={openEditModal}
      />

      <Modal
        opened={isEditorModalOpen}
        onClose={closeModal}
        title={editorModalTitle}
        centered
        withCloseButton={false}
        closeOnClickOutside={!(createVehicleMutation.isPending || updateVehicleMutation.isPending)}
        closeOnEscape={!(createVehicleMutation.isPending || updateVehicleMutation.isPending)}
      >
        {isEditorModalOpen ? (
          <VehicleForm
            key={modalState.mode === 'edit' ? modalState.vehicle.id : 'create-vehicle'}
            mode={modalState.mode}
            vehicle={modalState.mode === 'edit' ? modalState.vehicle : null}
            isSubmitting={createVehicleMutation.isPending || updateVehicleMutation.isPending}
            onSubmit={handleSubmitVehicle}
            onClose={closeModal}
          />
        ) : null}
      </Modal>

      <Modal
        opened={isDeleteModalOpen}
        onClose={closeModal}
        title="Delete vehicle"
        centered
        withCloseButton={false}
        closeOnClickOutside={!deleteVehicleMutation.isPending}
        closeOnEscape={!deleteVehicleMutation.isPending}
      >
        {isDeleteModalOpen && deleteTarget ? (
          <>
            <Text>{`Delete ${deleteTarget.brand} ${deleteTarget.model} (VIN: ${deleteTarget.vin})?`}</Text>
            <Group mt="md">
              <Button
                variant="outline"
                onClick={closeModal}
                disabled={deleteVehicleMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                color="red"
                loading={deleteVehicleMutation.isPending}
                onClick={handleConfirmDelete}
              >
                Delete
              </Button>
            </Group>
          </>
        ) : null}
      </Modal>
    </>
  );
}
