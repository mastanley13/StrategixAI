import { Route, Switch } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import Home from "@/pages/home";
import Solutions from "@/pages/solutions";
import Process from "@/pages/process";
import Results from "@/pages/results";
import Team from "@/pages/team";
import FAQ from "@/pages/faq";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/solutions" component={Solutions} />
        <Route path="/process" component={Process} />
        <Route path="/results" component={Results} />
        <Route path="/team" component={Team} />
        <Route path="/faq" component={FAQ} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

export default App;
