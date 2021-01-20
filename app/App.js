import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useDeviceOrientation} from './utils/Hooks';
import {navigationRef} from './utils/Functions';
import HamburgerMenu from './common/HamburgerMenu';
import * as Routes from './Routes';
const Drawer = createDrawerNavigator();

const App = (props) => {
  const [initRender, setInitRender] = useState(true);
  const [orientation, setOrientation] = useState('portrait');
  const deviceOrientation = useDeviceOrientation();

  useEffect(() => {
    setInitRender(false);
  }, [initRender]);

  useEffect(() => {
    setOrientation(deviceOrientation);
  }, [deviceOrientation]);

  let ScreenComponents = [];
  for (var k in Routes) ScreenComponents.push(k);
  console.log(deviceOrientation);
  return (
    <NavigationContainer ref={navigationRef}>
      <Drawer.Navigator
        drawerContent={(props) => <HamburgerMenu {...props} />}
        drawerStyle={{
          width: initRender ? null : orientation == 'portrait' ? '75%' : '35%',
        }}>
        {/* ADD STATIC STACKS STARTS HERE */}

        {/* ADD STATIC STACKS ENDS HERE */}
        {/*  */}
        {/* DYNAMIC SCREEN STACKS STARTS HERE */}
        {ScreenComponents.map((screenName, i) => {
          return (
            <Drawer.Screen
              key={i}
              name={screenName}
              component={Routes[screenName]}
            />
          );
        })}
        {/* DYNAMIC SCREEN STACKS ENDS HERE */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
