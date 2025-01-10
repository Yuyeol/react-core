import Child from "@/components/child";
import { createElement } from "@/utils/core/createElement";

const App = () => {
  return (
    <div>
      <h1>h1</h1>
      <Child name="one" />
    </div>
  );
};

export default App;
