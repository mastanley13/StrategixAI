import { Route, Switch } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import Home from "@/pages/home";
import Solutions from "@/pages/solutions";
import Process from "@/pages/process";
import Results from "@/pages/results";
import Team from "@/pages/team";
import FAQ from "@/pages/faq";
import Admin from "@/pages/admin";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import NotFound from "@/pages/not-found";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/solutions" component={Solutions} />
          <Route path="/process" component={Process} />
          <Route path="/results" component={Results} />
          <Route path="/team" component={Team} />
          <Route path="/faq" component={FAQ} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </MainLayout>
    </QueryClientProvider>
  );
}

export default App;
