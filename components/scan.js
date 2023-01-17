import { View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect } from "react";

function Scan() {
  useEffect(() => {
    (async () => {
      await BarCodeScanner.requestPermissionsAsync();
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  return 
  <View>
    <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
  </View>;
}

export default Scan;
