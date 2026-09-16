import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';

import type {
  TaskSortDirection,
  TaskSortField,
} from '../domain/task';
import {spacing} from '../../../shared/theme/theme';
import {FilterControl} from './FilterControl';

type Props = Readonly<{
  field: TaskSortField;
  direction: TaskSortDirection;
  onFieldChange: (field: TaskSortField) => void;
  onDirectionChange: (direction: TaskSortDirection) => void;
}>;

const fieldOptions = [
  {value: 'status', label: 'Estado'},
  {value: 'priority', label: 'Prioridad'},
] as const;

const directionOptions = [
  {value: 'ascending', label: 'Ascendente'},
  {value: 'descending', label: 'Descendente'},
] as const;

export function SortControls({
  field,
  direction,
  onFieldChange,
  onDirectionChange,
}: Props) {
  const {fontScale} = useWindowDimensions();
  const usesVerticalLayout = fontScale >= 1.2;

  return (
    <View style={[styles.row, usesVerticalLayout && styles.column]}>
      <View style={[styles.slot, usesVerticalLayout && styles.fullWidth]}>
        <FilterControl
          label="Ordenar por"
          value={field}
          options={fieldOptions}
          onChange={onFieldChange}
        />
      </View>
      <View style={[styles.slot, usesVerticalLayout && styles.fullWidth]}>
        <FilterControl
          label="Dirección"
          value={direction}
          options={directionOptions}
          onChange={onDirectionChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  column: {flexDirection: 'column'},
  slot: {flex: 1},
  fullWidth: {flex: 0, width: '100%'},
});
