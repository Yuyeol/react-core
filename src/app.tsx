import Child from "@/components/child";
import Header from "@/components/header";
import Counter from "@/components/counter";

const App = () => {
  return (
    <div>
      <Header title="header" />
      <h1>h1</h1>
      <Child name="one" />
      <Child />
      <Counter />
    </div>
  );
};

export default App;
