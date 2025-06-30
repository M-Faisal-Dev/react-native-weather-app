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
import { searchLocation, fetchForecast } from '../actions/weather';
import Geolocation from '@react-native-community/geolocation';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [location, setLocation] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({
    name: 'Faisalabad',
    country: 'Pakistan',
  });



    const selectLocation = async (item) => {
  
    const selected = {
      name: item.name,
      country: item.country || item.state || item.region || 'Unknown',
    };
    setSelectedLocation(selected);
    try {
      const forecastData = await fetchForecast(item.name, 7);
      setForecast(forecastData);
      console.log('Forecast data:', forecastData);
    } catch (err) {
      console.error('Error fetching forecast:', err);
    }
    setShowSearch(false);
    setSearchQuery('');
    setLocation([]);
  };

useEffect(() => {
  Geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      console.log('Current Location:', latitude, longitude);

      try {
        // Pass lat,long string into searchLocation
        const result = await searchLocation(`${latitude},${longitude}`);
        
        if (result?.length > 0) {
          const { name, country, state, region } = result[0];
          console.log(name, country, state, region )

          // Set selected location with name and country (or fallback to region/state)
          setSelectedLocation({
            name: name || 'Unknown',
            country: country || state || region || 'Unknown',
          });

          const forecastData = await fetchForecast(name, 7);
          setForecast(forecastData);
        }
      } catch (err) {
        console.error('Search location or forecast fetch failed:', err);
      }
    },
    (error) => {
      console.error('Location Error:', error);
      // fallback to Faisalabad
      selectLocation({ name: 'Faisalabad', country: 'Pakistan' });
    },
    {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 1000
    }
  );
}, []);

console.log(selectedLocation, "this is selected location");



  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!debouncedQuery.trim()) {
        setLocation([]);
        return;
      }
      try {
        const locationData = await searchLocation(debouncedQuery);
        setLocation(locationData || []);
      } catch (error) {
        console.error('Error fetching location:', error);
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



  return (
    <View className="flex-1 relative bg-black">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Image
        blurRadius={60}
        source={require('../assets/images/bg.png')}
        className="absolute w-full h-full z-0"
      />

      <SafeAreaView className="flex-1">
        <View className="relative flex-1">
          {/* Search Bar */}
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
                placeholder="Type something..."
                placeholderTextColor="#888"
              />
            )}
            <TouchableOpacity
              className="p-4 rounded-full bg-slate-200/20 m-1"
              onPress={() => {
                setShowSearch(!showSearch);
                if (showSearch) setSearchQuery('');
              }}
            >
              <MagnifyingGlassIcon size={20} color="#fff" />
            </TouchableOpacity>
          </View>

              {/* Search Suggestions */}
              {showSearch && location.length > 0 && (
                <View className="bg-slate-900/70 rounded-xl mt-3 max-h-80">
                  <ScrollView>
                    {location.map((item, index) => (
                      <TouchableOpacity
                        key={`${item.name}-${index}`}
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

          {/* Weather Info */}
          <View className="mx-4 flex-1 justify-around">
            <Text className="text-white text-center text-3xl mt-14 font-bold">
              {selectedLocation.name},
              <Text className="text-gray-300 text-lg font-semibold"> {selectedLocation.country}</Text>
            </Text>

            <View className="flex-row justify-center">
              <Image
                source={{
                  uri:
                    forecast?.current?.condition?.icon
                      ? `https:${forecast.current.condition.icon.replace('64x64', '128x128')}`
                      : 'https://via.placeholder.com/128',
                }}
                className="w-32 h-32"
              />
            </View>

           <View>
  <Text className="text-white text-center text-5xl font-bold">
    {forecast?.current?.temp_c ?? '--'}°C
  </Text>
  <Text className="text-white text-center text-sm mt-1">
    Feels like: {forecast?.current?.feelslike_c ?? '--'}°C
  </Text>
  <Text className="text-white text-center text-xl tracking-widest">
    {forecast?.current?.condition?.text ?? 'Loading...'}
  </Text>
</View>

            {/* Detailed Stats */}
            <View className="bg-slate-200/20 rounded-2xl p-4">
              <View className="flex-row justify-between mb-3">
                <MiniStat icon={require('../assets/icons/wind.png')} value={`${forecast?.current?.wind_kph ?? '--'} km/h`} label="Wind" />
                <MiniStat icon={require('../assets/icons/drop.png')} value={`${forecast?.current?.humidity ?? '--'}%`} label="Humidity" />
                <MiniStat icon={require('../assets/icons/sun.png')} value={forecast?.forecast?.forecastday?.[0]?.astro?.sunrise ?? '--'} label="Sunrise" />
              </View>
              <View className="flex-row justify-between">
                <TinyStat label="UV" value={forecast?.current?.uv ?? '--'} />
                <TinyStat label="Visibility" value={`${forecast?.current?.vis_km ?? '--'} km`} />
                <TinyStat label="Rain" value={`${forecast?.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain ?? '--'}%`} />
                <TinyStat label="Pressure" value={`${forecast?.current?.pressure_mb ?? '--'} mb`} />
              </View>
            </View>

            {/* 3-Day Forecast */}
            <View className="mt-4 mb-5">
              <View className="flex-row items-center mb-2">
                <CalendarDaysIcon size={22} color="#fff" />
                <Text className="text-white text-lg ml-2">7-Day Forecast</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {forecast?.forecast?.forecastday?.map((day, index) => {
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString('en', { weekday: 'short' });

                  return (
                    <View key={index} className="w-32 bg-slate-200/20 rounded-2xl p-3 mr-3">
                      <Text className="text-white text-center">{dayName}</Text>
                      <Image source={{ uri: `https:${day.day.condition.icon}` }} className="w-12 h-12 mx-auto my-1" />
                      <Text className="text-white text-center text-xl font-bold">{day.day.avgtemp_c}°C</Text>
                      <Text className="text-gray-400 text-xs text-center">{day.day.condition.text}</Text>
                      <View className="flex-row justify-between mt-2">
                        <Text className="text-white text-xs">H: {day.day.maxtemp_c}°</Text>
                        <Text className="text-white text-xs">L: {day.day.mintemp_c}°</Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

// Helper Components
const Stat = ({ icon, value, label }) => (
  <View className="flex-row items-center">
    <Image source={icon} className="w-6 h-6" />
    <Text className="text-white mx-2 text-lg font-semibold">{value}</Text>
  </View>
);

const MiniStat = ({ icon, value, label }) => (
  <View className="items-center">
    <Image source={icon} className="w-8 h-8" />
    <Text className="text-white mt-1">{value}</Text>
    <Text className="text-gray-400 text-xs">{label}</Text>
  </View>
);

const TinyStat = ({ label, value }) => (
  <View className="items-center">
    <Text className="text-white font-bold">{label}</Text>
    <Text className="text-white mt-1">{value}</Text>
  </View>
);
