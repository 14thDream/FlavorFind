import { Text, TextInput } from "react-native";

const EditableText = (props) => {
  return props.isEditable ? (
    <TextInput {...props} placeholderTextColor="gray" />
  ) : (
    <Text style={props.style}>{props.value}</Text>
  );
};

export default EditableText;
