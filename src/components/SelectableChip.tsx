import { Pressable, StyleSheet, Text } from 'react-native';

type SelectableChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function SelectableChip({ label, selected, onPress }: SelectableChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CDE8EA',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  selected: {
    backgroundColor: '#FFF2B8',
    borderColor: '#F3CA45',
  },
  pressed: {
    opacity: 0.78,
  },
  label: {
    color: '#335C67',
    fontSize: 15,
    fontWeight: '600',
  },
  selectedLabel: {
    color: '#4E3C00',
  },
});
