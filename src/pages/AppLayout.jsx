import SideBar from "../components/UI/SideBar";
import Map from "../components/App/Map";

import styles from "./AppLayout.module.css";
import User from "../components/Auth/User";

function AppLayout() {
  return (
    <div className={styles.app}>
      <SideBar />
      <Map />
      <User />
    </div>
  );
}

export default AppLayout;
