import React, { FC } from "react";
import styles from "./spinner.module.scss";

const Spinner: FC = () => {
  return <div className={styles.loader}>Loading...</div>;
};

export default Spinner;
