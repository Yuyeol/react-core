import Child from "@/components/child";
import Header from "./components/header";

const App = () => {
  return (
    <div>
      <Header title="header" />
      <h1>h1</h1>
      <Child name="one" />
      <Child />
    </div>
  );
};

export default App;
