import { View, Text, Image } from 'react-native'
import React from 'react' 
import {icons} from "@/constants/icons";
import Carousel from 'react-native-reanimated-carousel';
import { useState } from 'react';

const carouselData = [
  { id: '1', title: 'Virtual Actor Dressing', image: icons.personb },
  { id: '2', title: ' Personalized Outfit Creation', image: icons.untitled },
  { id: '3', title: 'Seamless Integration', image: icons.starb },
];

const CarouselGallrey = () => {

    const [activeSlide, setActiveSlide] = useState(0);
    const renderCarouselItem = ({ item }: { item: typeof carouselData[0] }) => (
        <View className="bg-primary rounded-xl overflow-hidden w-[360px] h-[290px] justify-center items-center">
            <Image 
                source={item.image} 
                className="w-[200px] h-full" 
                resizeMode="cover" 
                style={{ borderRadius: 12 }}
            />
            <View className="absolute bottom-0 left-0 right-0 bg-primary bg-opacity-50 p-2">
                <Text className="text-secondary text-[24px] font-semibold text-center">{item.title}</Text>
            </View>
        </View>
    );

    return(
    <View className="mb-4 mt-10">
                <Text className="text-[30px] mb-1 font-bold justify-center text-center text-dark-100">
                AI-Powered Outfit Generation </Text>
                <Text className="text-light-300 justify-center mx-5 text-center mt-1"> Whether you're a stylist looking to experiment or a fashion enthusiast exploring new trends, we enable you to visualize and perfect your style before making any choices.</Text>
 
                <View className="items-center">
                    <Carousel
                        loop
                        width={360}
                        height={240}
                        autoPlay={true}
                        data={carouselData}
                        scrollAnimationDuration={5000}
                        onSnapToItem={(index) => setActiveSlide(index)}
                        renderItem={renderCarouselItem}
                        mode="parallax"
                        modeConfig={{
                            parallaxScrollingOffset: 80, // controls space between items
                            parallaxScrollingScale: 0.7, // item scale while swiping
                        }}
                    />
                </View>
            </View>
)}

export default CarouselGallrey



