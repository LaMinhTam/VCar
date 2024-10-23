
import React from 'react';
import PromoSection from '../modules/home/PromoSection';
import VehicleSection from '../modules/home/VehicleSection';
import LayoutMain from '../layouts/LayoutMain';

export default function HomeScreen() {
    return (
        <LayoutMain>
            <PromoSection />

            <VehicleSection
                title="Top vehicle"
                type="TOP"
            />

            <VehicleSection
                title="Vehicle for you"
                type="FOR_YOU"
            />

            <VehicleSection
                title="Vehicle near you"
                type="NEAR_YOU"
            />
        </LayoutMain>
    );
}
