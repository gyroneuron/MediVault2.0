import { View, Text, TextInput} from "react-native";
import React from "react";

const InputField = ({fieldTitle,value, placedHolder,setValue,setTyping, textColor, type, styles, headingStyles}) => {
  return (
    <View>
      <Text className={`text-white text-sm my-3 self-start ${headingStyles}`}>{fieldTitle}</Text>
      <View className={`rounded-2xl border-y-2 focus:shadow-lg focus:shadow-gray-50 h-16 w-full items-center justify-center ${styles}`}>
        <TextInput
          className="w-full h-full text-lg px-4 text-dark-icon"
          value={value}
          onChangeText={(text) => {
            setValue(text);
            setTyping(true);
          }}
          placeholder={placedHolder}
          placeholderTextColor={textColor}
          keyboardType={type}
          cursorColor={"#FF8E01"}
        />
      </View>
    </View>
  );
};

export default InputField;
