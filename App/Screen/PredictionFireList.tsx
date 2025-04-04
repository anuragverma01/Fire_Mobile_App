import FireList from "../Compoment/FireList";

const PredictionFireList = () => {
  return (
    <FireList
      apiUrl="https://app-rewt.onrender.com/fire-risk"
      title="Prediction Fire Alerts"
      filterHighRisk={true}
    />
  );
};
export default PredictionFireList;