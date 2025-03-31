import {Text , View, StyleSheet , Dimensions, FlatList } from 'react-native';
import {Image} from 'expo-image';
import {SliderProps} from './interface';
import React from 'react';
import Animated from 'react-native-reanimated';



const {width} = Dimensions.get('screen');


const SliderItem = ({data}: {data: SliderProps}) => {
    return (
        <View style={{width, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={{ uri: data.image }} style={{ width: 200, height: 200 }} />
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>{data.title}</Text>
            <Text style={{fontSize: 16, textAlign: 'center', marginVertical: 10}}>{data.description}</Text>
            
        </View>
    );
}
const Pagination = ({data}: {data: SliderProps[]}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      {data.map((_, i) => {
        
        
        return (
          <Animated.View
            key={i}
            style={{
              width: 10,
              height: 10,
              backgroundColor: 'black',
              borderRadius: 5,
              marginHorizontal: 5,
            }}
          />
        );
      })}
    </View>
  );
}


const Slider = ({data} : {data :SliderProps[]}) => {
    return (

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <FlatList 
        data={data}
        renderItem={({item}) => <SliderItem data={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        keyExtractor={(item, index) => index.toString()}
        />
        <Pagination data={data} />
        </View>
       
    );
  }
  

  export default Slider;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    backgroundColor: '#841584',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  
  }}
)