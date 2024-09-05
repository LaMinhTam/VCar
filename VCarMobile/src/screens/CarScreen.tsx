import { View, Text, TextInput } from 'react-native';
import React, { useRef } from 'react';
import LayoutMain from '../layouts/LayoutMain';
import { Button, Icon, SearchBar } from 'react-native-elements';
import FilterPopup from '../modules/car/FilterPopup';


const CarScreen = () => {
    const [search, setSearch] = React.useState('');
    const [filterVisible, setFilterVisible] = React.useState(false);

    return (
        <LayoutMain>
            <View className="flex-row items-center justify-between p-4 bg-white">
                {/* Search Input */}
                <View className="flex-row items-center flex-1 px-4 py-2 mr-4 bg-gray-200 rounded-full">
                    <Icon
                        name="search"
                        type="feather"
                        size={20}
                        color="#9CA3AF"
                    />
                    <TextInput
                        className="flex-1 w-full h-10 ml-2 text-text2"
                        placeholder="Search car..."
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Filter Button */}
                <Button
                    icon={
                        <Icon
                            name="filter"
                            type="feather"
                            size={24}
                            color="white"
                        />
                    }
                    buttonStyle={{ backgroundColor: '#3B82F6', borderRadius: 50 }}
                    onPress={() => setFilterVisible(true)}
                />
            </View>
            <FilterPopup isVisible={filterVisible} toggleDialog={() => setFilterVisible(!filterVisible)} />
        </LayoutMain>
    );
};

export default CarScreen;