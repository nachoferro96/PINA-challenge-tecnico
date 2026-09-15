import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {radii, spacing, useAppTheme} from '../../../shared/theme/theme';

type FilterOption<T extends string> = {value: T; label: string};

type FilterControlProps<T extends string> = {
  label: string;
  value: T;
  options: readonly FilterOption<T>[];
  onChange: (value: T) => void;
};

export function FilterControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: FilterControlProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const {colors} = useAppTheme();
  const selected = options.find(option => option.value === value) ?? options[0];

  return (
    <View style={styles.container}>
      <Text style={[styles.caption, {color: colors.textSecondary}]}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selected.label}`}
        accessibilityState={{expanded}}
        onPress={() => setExpanded(current => !current)}
        style={({pressed}) => [
          styles.trigger,
          {backgroundColor: pressed ? colors.surfaceStrong : colors.surface},
        ]}>
        <Text numberOfLines={1} style={[styles.triggerText, {color: colors.text}]}>
          {selected.label}
        </Text>
        <View
          style={[
            styles.chevron,
            {borderColor: colors.text, transform: [{rotate: expanded ? '225deg' : '45deg'}]},
          ]}
        />
      </Pressable>
      {expanded ? (
        <View style={[styles.options, {borderColor: colors.divider}]}>
          {options.map(option => {
            const isSelected = option.value === value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{checked: isSelected}}
                onPress={() => {
                  onChange(option.value);
                  setExpanded(false);
                }}
                style={({pressed}) => [
                  styles.option,
                  {
                    backgroundColor: isSelected
                      ? colors.accentSoft
                      : pressed
                        ? colors.surface
                        : colors.background,
                  },
                ]}>
                <Text style={[styles.optionText, {color: isSelected ? colors.accent : colors.text}]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {width: '100%', minWidth: 140},
  caption: {fontSize: 15, marginBottom: spacing.xs},
  trigger: {
    minHeight: 52,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerText: {fontSize: 17, fontWeight: '500'},
  chevron: {width: 10, height: 10, borderRightWidth: 2, borderBottomWidth: 2, marginRight: 3},
  options: {marginTop: spacing.xs, borderWidth: StyleSheet.hairlineWidth, borderRadius: radii.md, overflow: 'hidden'},
  option: {minHeight: 48, justifyContent: 'center', paddingHorizontal: spacing.md},
  optionText: {fontSize: 16, fontWeight: '500'},
});
