import React, {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';

function useDeviceOrientation() {
  const [deviceOrientation, setDeviceOrientation] = useState(null);

  useEffect(() => {
    function updateState() {
      const {height, width} = Dimensions.get('window');
      if (height >= width) {
        setDeviceOrientation('portrait');
      } else {
        setDeviceOrientation('landscape');
      }
    }

    updateState();
    Dimensions.addEventListener('change', updateState);
    return () => Dimensions.removeEventListener('change', updateState);
  }, []);

  return deviceOrientation;
}

export {useDeviceOrientation};
