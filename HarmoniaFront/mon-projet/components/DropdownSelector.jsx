import React from 'react';
import { SelectCountry } from 'react-native-element-dropdown';
import { StyleSheet } from 'react-native';

const DropdownSelector = ({ data, selectedValue, onSelect, placeholder }) => (
  <SelectCountry
    style={styles.dropdown}
    selectedTextStyle={styles.selectedTextStyle}
    placeholderStyle={styles.placeholderStyle}
    maxHeight={200}
    value={selectedValue}
    data={data}
    valueField="value"
    labelField="label"
    placeholder={placeholder}
    onChange={onSelect}
  />
);

const styles = StyleSheet.create({
  dropdown: { height: 50, width: 100, backgroundColor: '#ffffb3', borderWidth: 1, borderRadius: 8, paddingHorizontal: 8 },
  placeholderStyle: { fontSize: 16 },
  selectedTextStyle: { fontSize: 16, marginLeft: 8 },
});

export default DropdownSelector;
