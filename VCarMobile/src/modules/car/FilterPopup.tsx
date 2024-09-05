import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { CheckBox, Button, Dialog, Slider, Icon, Chip } from 'react-native-elements';
import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window'); // Lấy chiều cao màn hình

const FilterPopup = ({ isVisible, toggleDialog }: {
    isVisible: boolean,
    toggleDialog: () => void
}) => {
    const [rentalType, setRentalType] = useState('Day');
    const [carTypes, setCarTypes] = useState(['Sport', 'SUV', 'MPV']);
    const [capacity, setCapacity] = useState(['2 Person', '4 Person']);
    const [price, setPrice] = useState(50);

    return (
        <Dialog
            isVisible={isVisible}
            onBackdropPress={toggleDialog}
            overlayStyle={{
                width: '100%', // Chiếm toàn bộ chiều rộng
                height: height * 0.8, // Chiều cao là 80% màn hình
                position: 'absolute',
                bottom: 0, // Từ dưới lên
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 0 // Loại bỏ padding mặc định để kiểm soát spacing
            }}
        >
            {/* Icon Close */}
            <View className="absolute z-10 top-2 right-2">
                <Icon
                    name="close"
                    type="material"
                    size={24}
                    onPress={toggleDialog}
                />
            </View>

            <ScrollView>
                <View className="p-4">
                    {/* Rental Type */}
                    <Text className="mb-4 text-lg font-bold">Rental Type</Text>
                    <View className="flex-row mb-4">
                        <Chip
                            title="Day"
                            containerStyle={{ marginRight: 20 }} // Cách giữa các Chip
                            buttonStyle={{ backgroundColor: rentalType === 'Day' ? '#3B82F6' : '#F3F4F6', borderRadius: 10 }}
                            onPress={() => setRentalType('Day')}
                            titleStyle={{ color: rentalType === 'Day' ? 'white' : 'black' }}
                        // type='solid'
                        />
                        <Chip
                            title="Hour"
                            containerStyle={{ marginRight: 20 }} // Cách giữa các Chip
                            buttonStyle={{ backgroundColor: rentalType === 'Hour' ? '#3B82F6' : '#F3F4F6', borderRadius: 10 }}
                            onPress={() => setRentalType('Hour')}
                            titleStyle={{ color: rentalType === 'Hour' ? 'white' : 'black' }}
                        // type='outline'
                        />
                        <Chip
                            title="Month"
                            containerStyle={{ marginRight: 20 }} // Cách giữa các Chip
                            buttonStyle={{ backgroundColor: rentalType === 'Month' ? '#3B82F6' : '#F3F4F6', borderRadius: 10 }}
                            onPress={() => setRentalType('Month')}
                            titleStyle={{ color: rentalType === 'Month' ? 'white' : 'black' }}
                        // type='outline'
                        />
                    </View>

                    {/* Car Type */}
                    <Text className="mb-4 text-lg font-bold">Type</Text>
                    <View className="flex-row flex-wrap">
                        {['Sport', 'SUV', 'MPV', 'Sedan', 'Coupe', 'Hatchback'].map((type) => (
                            <CheckBox
                                key={type}
                                title={type}
                                checked={carTypes.includes(type)}
                                onPress={() => {
                                    setCarTypes((prev) =>
                                        prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
                                    );
                                }}
                                containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                            />
                        ))}
                    </View>

                    {/* Capacity */}
                    <Text className="mb-4 text-lg font-bold">Capacity</Text>
                    <View className="flex-row flex-wrap">
                        {['2 Person', '4 Person', '6 Person', '8 or More'].map((cap) => (
                            <CheckBox
                                key={cap}
                                title={cap}
                                checked={capacity.includes(cap)}
                                onPress={() => {
                                    setCapacity((prev) =>
                                        prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
                                    );
                                }}
                                containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                            />
                        ))}
                    </View>

                    {/* Price */}
                    <Text className="mb-4 text-lg font-bold">Price</Text>
                    <Slider
                        value={price}
                        onValueChange={setPrice}
                        maximumValue={100}
                        minimumValue={0}
                        step={1}
                        style={{ width: '100%' }}
                    />
                    <Text>From $0 to ${price}</Text>

                    {/* Apply Button */}
                    <Button title="Apply Filter" buttonStyle={{ backgroundColor: '#3B82F6', borderRadius: 10 }} />
                </View>
            </ScrollView>
        </Dialog>
    );
};

export default FilterPopup;
