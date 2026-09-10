import { useContext } from "react";
import NotificationContext from "./NotificationContext";

function useNotification() {
  return useContext(NotificationContext);
}

export default useNotification;