import React from "react";
import FireMapScreen from "../Compoment/FireMapScreen";

const PredictionFireMapScreen: React.FC = () => {
  return <FireMapScreen apiUrl="https://app-rewt.onrender.com/fire-risk?limit=5000" filterHighRisk={true} />;
};
export default PredictionFireMapScreen;