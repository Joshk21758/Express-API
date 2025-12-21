import AsyncStorage from "@react-native-async-storage/async-storage";

const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem("@authToken", token);
    console.log("Token stored");
  } catch (err) {
    console.log("Error storing token");
  }
};
