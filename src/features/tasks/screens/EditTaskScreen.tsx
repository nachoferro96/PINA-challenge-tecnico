import React, {useMemo, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {RootStackParamList} from '../../../app/navigation/types';
import {radii, spacing, useAppTheme} from '../../../shared/theme/theme';
import {FilterControl} from '../components/FilterControl';
import type {TaskPriority, TaskStatus} from '../domain/task';
import {priorityLabels, statusLabels} from '../domain/taskLabels';
import {useTasks} from '../state/TaskContext';
import {findTaskById} from '../state/taskSelectors';

type Props = NativeStackScreenProps<RootStackParamList, 'EditTask'>;

type FieldProps = Readonly<{
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
}>;

const statusOptions = (['pending', 'inProgress', 'completed'] as const).map(
  value => ({value, label: statusLabels[value]}),
);

const priorityOptions = (['low', 'medium', 'high'] as const).map(value => ({
  value,
  label: priorityLabels[value],
}));

function TaskField({label, value, onChangeText, multiline}: FieldProps) {
  const {colors} = useAppTheme();

  return (
    <View style={styles.field}>
      <Text style={[styles.label, {color: colors.textSecondary}]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        multiline={multiline}
        onChangeText={onChangeText}
        selectionColor={colors.accent}
        style={[
          styles.input,
          multiline && styles.multilineInput,
          {backgroundColor: colors.surface, color: colors.text},
        ]}
        textAlignVertical={multiline ? 'top' : 'center'}
        value={value}
      />
    </View>
  );
}

export function EditTaskScreen({navigation, route}: Props) {
  const insets = useSafeAreaInsets();
  const {fontScale} = useWindowDimensions();
  const {colors} = useAppTheme();
  const {state, updateTask} = useTasks();
  const task = findTaskById(state.tasks, route.params.taskId);
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [area, setArea] = useState(task?.area ?? '');
  const [assignee, setAssignee] = useState(task?.assignee ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'pending');
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? 'medium',
  );
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );

  const hasChanges = useMemo(
    () =>
      task !== undefined &&
      (title !== task.title ||
        description !== task.description ||
        area !== task.area ||
        assignee !== task.assignee ||
        status !== task.status ||
        priority !== task.priority),
    [area, assignee, description, priority, status, task, title],
  );

  if (!task) {
    return (
      <View style={[styles.missing, {backgroundColor: colors.background}]}>
        <Text style={[styles.missingTitle, {color: colors.text}]}>Tarea no disponible</Text>
        <Text style={[styles.helper, {color: colors.textSecondary}]}>No hay una tarea para editar.</Text>
      </View>
    );
  }

  const save = () => {
    const fields = [title, description, area, assignee].map(value =>
      value.trim(),
    );

    if (fields.some(value => value.length === 0)) {
      setValidationMessage('Completá todos los campos antes de guardar.');
      return;
    }

    updateTask({
      ...task,
      title: fields[0],
      description: fields[1],
      area: fields[2],
      assignee: fields[3],
      status,
      priority,
    });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      style={[styles.flex, {backgroundColor: colors.background}]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {paddingBottom: insets.bottom + spacing.xl},
        ]}
        keyboardShouldPersistTaps="handled">
        <TaskField label="Título" value={title} onChangeText={setTitle} />
        <TaskField
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TaskField label="Área" value={area} onChangeText={setArea} />
        <TaskField
          label="Responsable"
          value={assignee}
          onChangeText={setAssignee}
        />

        <View
          style={[
            styles.selectors,
            fontScale >= 1.2 && styles.selectorsLargeText,
          ]}>
          <View
            style={[
              styles.selectorSlot,
              fontScale >= 1.2 && styles.selectorSlotLargeText,
            ]}>
            <FilterControl
              label="Estado"
              value={status}
              options={statusOptions}
              onChange={setStatus}
            />
          </View>
          <View
            style={[
              styles.selectorSlot,
              fontScale >= 1.2 && styles.selectorSlotLargeText,
            ]}>
            <FilterControl
              label="Prioridad"
              value={priority}
              options={priorityOptions}
              onChange={setPriority}
            />
          </View>
        </View>

        {validationMessage ? (
          <Text accessibilityRole="alert" style={[styles.error, {color: colors.accent}]}>
            {validationMessage}
          </Text>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityState={{disabled: !hasChanges}}
          disabled={!hasChanges}
          onPress={save}
          style={({pressed}) => [
            styles.saveButton,
            {
              backgroundColor: !hasChanges
                ? colors.surfaceStrong
                : pressed
                  ? colors.accentSoft
                  : colors.accent,
            },
          ]}>
          <Text
            style={[
              styles.saveLabel,
              {color: hasChanges ? colors.background : colors.textSecondary},
            ]}>
            Guardar cambios
          </Text>
        </Pressable>
        <Text style={[styles.helper, {color: colors.textSecondary}]}>Los cambios se conservan mientras la app permanezca abierta.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  content: {paddingHorizontal: spacing.lg, paddingTop: spacing.lg},
  field: {marginBottom: spacing.md},
  label: {fontSize: 15, marginBottom: spacing.xs},
  input: {
    minHeight: 52,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    fontSize: 17,
  },
  multilineInput: {minHeight: 112, paddingTop: spacing.sm},
  selectors: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  selectorsLargeText: {flexDirection: 'column'},
  selectorSlot: {flex: 1},
  selectorSlotLargeText: {flex: 0, width: '100%'},
  error: {fontSize: 15, lineHeight: 21, marginTop: spacing.md},
  saveButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  saveLabel: {fontSize: 17, fontWeight: '700'},
  helper: {fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: spacing.sm},
  missing: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl},
  missingTitle: {fontSize: 22, fontWeight: '700'},
});
