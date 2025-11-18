import { getAllCountries } from '@/service/httpsRequest';
import styles from '@/stylesheets/languageScreenStylesheet';
import { Country } from '@/type';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Keyboard, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';





const Index = () => {
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const filteredCountries = search
    ? countries.filter(c =>
        c.name.common.toLowerCase().includes(search.toLowerCase())
      )
    : countries;

  useEffect(() => {
    setLoading(true);
    async function load() {
      try {
        const fetchedCountries = await getAllCountries();
        setCountries(fetchedCountries || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
        alert("Failed to fetch countries, please reload the app");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      style={{
        ...styles.countryList,
        backgroundColor: selectedCountry?.cca2 === item.cca2 ? "#cccfd3ff" : undefined,
      }}
      onPress={() => setSelectedCountry(item)}
    >
      <View style={styles.countryListInnerView}>
        <Image
          source={{ uri: item.flags.png }}
          style={{ height: 40, width: 40, borderRadius: 999 }}
          resizeMode="cover"
        />
        <Text style={styles.Countryname}>{item.name.common}</Text>
      </View>

      {selectedCountry?.cca2 === item.cca2 ? (
        <MaterialIcons name="check-circle" size={24} color="blue" />
      ) : (
        <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={24} color="#dfdfdfff" />
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{
        paddingTop: inset.top,
        paddingBottom: inset.bottom,
        ...styles.container,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Text style={styles.chooseYourLanguageTitle}>
            Choose your preferred country
          </Text>
          <Text style={styles.chooseYourLanguageText}>
            Select your preferred country to help us provide a better experience
          </Text>

          <Text style={styles.yourSelectedLanguageTitle}>You Selected</Text>
          <View style={styles.selectedLanguageView}>
            <Text>
              {selectedCountry ? selectedCountry.name.common : "None selected"}
            </Text>
            {selectedCountry && <MaterialIcons name="check-circle" size={24} color="blue" />}
          </View>

          <Text style={styles.yourSelectedLanguageTitle}>
            All Countries
          </Text>

          <View style={styles.LanguageOptionView}>
            <View style={styles.searchContainer}>
              <Feather name="search" size={24} color="#474747ff" />
              <TextInput
                placeholder="Search"
                style={styles.textInput}
                placeholderTextColor="#dfdfdfff"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {loading ? (
               <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 20,
                    }}
                >
                    <ActivityIndicator size="large" color="#D32f2f" />
                </View>
            ) : (
              <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item.cca2}
                renderItem={renderCountryItem}
                style={{ marginTop: 10 }}
              />
            )}
          </View>

            <TouchableOpacity 
              onPress={() => router.replace('./onboarding')}
              style={styles.continueButton}>
              <Text style={styles.btnText}>
                Continue
              </Text>
            </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Index;
