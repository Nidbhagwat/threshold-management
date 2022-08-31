import { modalController, toastController } from '@ionic/vue';
import { DateTime } from "luxon";
import ErrorMessageModal from "@/components/ErrorMessageModal.vue";

// TODO Use separate files for specific utilities

// TODO Remove it when HC APIs are fully REST compliant
const hasError = (response: any) => {
    return !!response.data._ERROR_MESSAGE_ || !!response.data._ERROR_MESSAGE_LIST_;
}

const showToast = async (message: string, err?: any) => {
  if(message === "Something went wrong" && err) {
    const toast = await toastController
    .create({
      message,
      duration: 3000,
      position: 'bottom',
      buttons: [
        {
          text: 'view',
          side: 'end',
          handler: async () => {
            const errorMessageModal = await modalController.create({
              component: ErrorMessageModal,
              componentProps: {
                errorMessage: err,
              },
              initialBreakpoint: 0.08,
              breakpoints: [0, 0.10, 0.5, 0.75]
            });
            return errorMessageModal.present();
          }
        }
      ]
    })
    return toast.present();
  } else {
    const toast = await toastController
      .create({
        message,
        duration: 3000,
        position: 'bottom',
      })
    return toast.present();
  }
}

const getFeature = (featureHierarchy: any, featureKey: string) => {
  let featureValue = ''
  if (featureHierarchy) {
    const feature = featureHierarchy.find((featureItem: any) => featureItem.startsWith(featureKey))
    const featureSplit = feature ? feature.split('/') : [];
    featureValue = featureSplit[2] ? featureSplit[2] : '';
  }
  return featureValue;
}

const handleDateTimeInput = (dateTimeValue: any) => {
  // TODO Handle it in a better way
  // Remove timezone and then convert to timestamp
  // Current date time picker picks browser timezone and there is no supprt to change it
  const dateTime = DateTime.fromISO(dateTimeValue, { setZone: true}).toFormat("yyyy-MM-dd'T'HH:mm:ss")
  return DateTime.fromISO(dateTime).toMillis()
}
export { handleDateTimeInput, showToast, hasError, getFeature }
