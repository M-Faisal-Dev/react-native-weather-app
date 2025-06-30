import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarDaysIcon,
} from 'react-native-heroicons/outline';
import { searchLocation } from '../actions/weather';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [location, setLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({
    name: 'London',
    country: 'United Kingdom',
  });

  // Debounce the search query (500ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch location when debounced query changes
  useEffect(() => {
    const fetchLocation = async () => {
      if (debouncedQuery.trim() === '') {
        setLocation([]);
        return;
      }

      try {
        const locationData = await searchLocation(debouncedQuery);
        setLocation(locationData || []);
      } catch (error) {
        console.error('Error fetching location data:', error);
        setLocation([]);
      }
    };

    fetchLocation();
  }, [debouncedQuery]);

  const handleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery('');
      setLocation([]);
    }
  };

  const selectLocation = (item) => {
    setSelectedLocation({
      name: item.name,
      country: item.country || item.state || 'Unknown',
    });
    setShowSearch(false);
    setSearchQuery('');
    setLocation([]);
  };

  return (
    <View className="flex-1 relative bg-black">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <Image
        blurRadius={60}
        source={require('../assets/images/bg.png')}
        className="absolute w-full h-full z-0"
      />

      <SafeAreaView className="flex-1">
        <View className="relative flex-1">
          <View className="h-16">
            <View className="absolute top-10 left-4 right-4 z-50">
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  borderRadius: 9999,
                  backgroundColor: showSearch ? 'rgba(226, 232, 240, 0.2)' : 'transparent',
                  borderWidth: showSearch ? 1 : 0,
                  borderColor: 'rgba(226, 232, 240, 0.2)',
                }}
              >
                {showSearch && (
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    className="pl-6 h-14 flex-1 text-white"
                    placeholder="Search city..."
                    placeholderTextColor="#888"
                  />
                )}
                <TouchableOpacity
                  className="p-4 rounded-full bg-slate-200/20 m-1"
                  onPress={handleSearch}
                >
                  <MagnifyingGlassIcon size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              {showSearch && location.length > 0 && (
                <View className="bg-slate-900/70 rounded-xl mt-3 max-h-80">
                  <ScrollView>
                    {location.map((item, index) => (
                      <TouchableOpacity
                        key={item.name + index}
                        className="flex-row items-center p-4 border-b border-gray-700"
                        onPress={() => selectLocation(item)}
                      >
                        <MapPinIcon size={20} color="#fff" />
                        <Text className="text-white ml-2">
                          {item.name}, {item.country || item.state}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          <View className="mx-4 flex justify-around flex-1">
            <Text className="text-white text-center text-2xl mt-8 font-bold">
              {selectedLocation.name},
              <Text className="text-gray-300 text-lg font-semibold"> {selectedLocation.country}</Text>
            </Text>

            <View className="flex-row justify-center">
              <Image
                source={require('../assets/images/partlycloudy.png')}
                className="w-52 h-52"
              />
            </View>

            <View>
              <Text className="text-white text-center text-5xl font-bold ml-5">25°C</Text>
              <Text className="text-white text-center text-xl font-medium tracking-widest">Partly cloudy</Text>
            </View>

            <View className="flex-row justify-between items-center mx-2">
              <View className="flex-row items-center">
                <Image source={require('../assets/icons/wind.png')} className="w-6 h-6" />
                <Text className="text-white mx-2 text-lg font-semibold">10 km/h</Text>
              </View>
              <View className="flex-row items-center">
                <Image source={require('../assets/icons/drop.png')} className="w-6 h-6" />
                <Text className="text-white mx-2 text-lg font-semibold">22%</Text>
              </View>
              <View className="flex-row items-center">
                <Image source={require('../assets/icons/sun.png')} className="w-6 h-6" />
                <Text className="text-white mx-2 text-lg font-semibold">6:00 AM</Text>
              </View>
            </View>

            <View className="mb-2 space-y-2">
              <View className="flex-row items-center my-3 mx-5">
                <CalendarDaysIcon size={22} color="#fff" />
                <Text className="text-white text-base ml-2">Daily Forecast</Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}
              >
                {[...Array(5)].map((_, index) => (
                  <View
                    key={index}
                    className="flex justify-center items-center w-24 py-3 bg-slate-200/20 rounded-3xl mr-2"
                  >
                    <Image
                      source={require('../assets/images/heavyrain.png')}
                      className="w-12 h-11"
                    />
                    <Text className="text-white">Monday</Text>
                    <Text className="text-white text-xl font-semibold">25°C</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
