import axios from "axios";
import configData from "../config.json";

const baseUrl = configData.safestreetsApi;

const instance = axios.create({
  baseURL: baseUrl
})

class SafestreetsApi {
  static setGpsLocation(gpsLocation, macAddress) {
    return instance.post("/location/set-gps-location", gpsLocation);
  }

  static getCamera(macAddress) {
    return instance.get(`/camera/${macAddress}`)
  }

  static getCameras() {
    return instance.get('/camera')
  }

  static updateLocation(location) {
    console.log(location)
    return instance.patch(`/location/${location.locationId}`, location)
  }

  static createLocationCamera(locationCamera) {
    return instance.post("/location/create-location-camera", locationCamera)
  }
}

export default SafestreetsApi;
