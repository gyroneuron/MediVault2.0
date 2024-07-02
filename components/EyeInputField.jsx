import { View, Text, TextInput } from "react-native";
import React from "react";

const EyeInputField = ({fieldTitle,value, placedHolder,setValue,setTyping, textColor, type,isFieldVisible, styles, headingStyles}) => {
  return (
    <View>
        <Text className={`text-white self-start text-base my-3 ${headingStyles}`}>
            {fieldTitle}
        </Text>
      <TextInput
        className={`w-[90%] h-full text-base px-4 text-[#E7DECD] ${styles}`}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          setTyping(true);
        }}
        placeholder={placedHolder}
        placeholderTextColor={textColor}
        keyboardType={type}
        cursorColor={"#FF8E01"}
        secureTextEntry={!isFieldVisible}
      />
    </View>
  );
};

export default EyeInputField;
