import Logo from "../HomePage/Logo";
import AppNav from "../App/AppNav";

import styles from "./SideBar.module.css";
import Footer from "../HomePage/Footer";
import { Outlet } from "react-router-dom";

function SideBar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <Footer />
    </div>
  );
}

export default SideBar;
