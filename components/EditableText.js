import { Text, TextInput } from "react-native";

const EditableText = ({
  placeholder,
  value,
  onChangeText,
  rows,
  multiline,
  editable,
  style,
  inputStyle,
}) => {
  return editable ? (
    <TextInput
      multiline={multiline}
      rows={rows}
      placeholder={placeholder}
      placeholderTextColor="gray"
      value={value}
      onChangeText={onChangeText}
      style={[style, inputStyle]}
    />
  ) : (
    <Text style={style}>{value}</Text>
  );
};

export default EditableText;
