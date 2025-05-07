import { Text, TextInput } from "react-native";

const EditableText = ({
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
      value={value}
      onChangeText={onChangeText}
      style={[style, inputStyle]}
    />
  ) : (
    <Text style={style}>{value}</Text>
  );
};

export default EditableText;
