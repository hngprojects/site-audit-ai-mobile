import styles from "@/Stylesheets/newPasswordStylesheet";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NewPassword() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

    const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [mismatchedPassword, setMismatchedPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const Reset = () => {
        setLoading(true);

        if (password !== confirmPassword) {
            setMismatchedPassword(true);
            alert("Password mismatch");
            setLoading(false);
            return;   
        }

        if (password === "" || confirmPassword === "") {
            setMismatchedPassword(true);
            alert("Please enter your desired password");
            setLoading(false);
            return;   
        }

        try {
            
            router.push("./passwordResetSuccess")
        } finally {
            setLoading(false);
        }
        
    }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
     
       <View style= {styles.headerSection}>
            <TouchableOpacity 
                onPress={router.back}
                style={styles.backarrow}
            >
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
      
            <Text style={styles.headerText}>
                New Password
            </Text>
                  
        </View>

      <Text style={styles.subTitle}>
        Your new password must be different from the previous one.
      </Text>

  
   
        <Text style={styles.label}>
            Password
        </Text>
      
            <View style={{
                ...styles.input,
                borderColor: mismatchedPassword ? "#d32f2f" : "#babec6",
                }}
            >
                  <TextInput
                      placeholder="***********"
                      style={styles.passwordTextInput}
                      placeholderTextColor="#dfdfdfff"
                      value={password}
                      onChangeText={x => setPassword(x)}
                      secureTextEntry={secureTextEntry}
                  />
      
                  {secureTextEntry ? 
                      <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                          <Feather name="eye-off" size={24} color="#9ba1ab" />
                      </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                      <Feather name="eye" size={24} color="#9ba1ab" />
                  </TouchableOpacity>
                  }
      
            </View>


        <Text style={styles.label}>
            Confirm Password
        </Text>
      
            <View style={{
                ...styles.input,
                borderColor: mismatchedPassword ? "#d32f2f" : "#babec6",
                }} 
            >
                  <TextInput
                      placeholder="***********"
                      style={styles.passwordTextInput}
                      placeholderTextColor="#dfdfdfff"
                      value={confirmPassword}
                      onChangeText={x => setConfirmPassword(x)}
                      secureTextEntry={secureTextEntry}
                  />
      
                  {secureTextEntry ? 
                      <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                          <Feather name="eye-off" size={24} color="#9ba1ab" />
                      </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                      <Feather name="eye" size={24} color="#9ba1ab" />
                  </TouchableOpacity>
                  }
      
            </View>


            {loading ? (
                 <ActivityIndicator 
                    size="large" 
                    color="#ff5a3d" 
                    style={{marginTop: 20}} 
                />
            ) : (
                <TouchableOpacity
                    style={styles.resetBtn}
                    onPress={Reset}
                >
                    <Text style={styles.resetBtnText}>Reset</Text>
                </TouchableOpacity>
            )}
    </View>
  );
}
