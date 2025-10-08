import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "../utils/translator";

export default function PickerModal({
  visible,
  options = [],
  onSelect,
  onClose,
  title = "Select Option",
  renderItem,
}) {
  // Translate all text
  const closeText = useTranslation("Close");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 justify-end" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-3xl max-h-[60%] p-4"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold capitalize">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-red-500 font-medium">{closeText}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={
              renderItem ||
              (({ item }) => (
                <Pressable
                  className="py-3 px-4 border-b border-gray-200"
                  onPress={() => onSelect(item)}
                >
                  <Text className="text-base text-gray-800">{item}</Text>
                </Pressable>
              ))
            }
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
