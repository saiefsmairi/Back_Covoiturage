import { createDrawerNavigator } from '@react-navigation/drawer';
import Profil from '../screens/profil';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Feed" component={Profil} />
    </Drawer.Navigator>
  );
}
export default MyDrawer;