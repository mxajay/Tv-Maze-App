import React from 'react';
import {StyleSheet, TouchableOpacity, Image, FlatList} from 'react-native';

const ImageGrid = (props) => {
  const renderShows = ({item}) => (
    <TouchableOpacity
      style={[
        imageGridStyle.container,
        {
          ...props.style,
        },
      ]}
      onPress={() => props.onPress(item)}>
      <Image
        style={[imageGridStyle.image, {...props.imageStyles}]}
        source={{uri: typeof item == 'string' ? item : item.imageUri}}
      />
    </TouchableOpacity>
  );

  return (
    <React.Fragment>
      <FlatList
        data={props.items}
        renderItem={renderShows}
        keyExtractor={(item) => '' + item.id + ''}
        numColumns={3}
      />
    </React.Fragment>
  );
};

export default ImageGrid;

const imageGridStyle = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
