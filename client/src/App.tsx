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
import BlogDebug from "@/pages/blog-debug";
import NotFoundPage from "@/pages/not-found";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/">
          <MainLayout>
            <Home />
          </MainLayout>
        </Route>
        <Route path="/solutions">
          <MainLayout>
            <Solutions />
          </MainLayout>
        </Route>
        <Route path="/process">
          <MainLayout>
            <Process />
          </MainLayout>
        </Route>
        <Route path="/results">
          <MainLayout>
            <Results />
          </MainLayout>
        </Route>
        <Route path="/team">
          <MainLayout>
            <Team />
          </MainLayout>
        </Route>
        <Route path="/faq">
          <MainLayout>
            <FAQ />
          </MainLayout>
        </Route>
        <Route path="/blog">
          <MainLayout>
            <Blog />
          </MainLayout>
        </Route>
        <Route path="/blog/:slug">
          <MainLayout>
            <BlogPost />
          </MainLayout>
        </Route>
        <Route path="/blog-debug">
          <MainLayout>
            <BlogDebug />
          </MainLayout>
        </Route>
        <Route path="/admin">
          <MainLayout>
            <Admin />
          </MainLayout>
        </Route>
        <Route component={NotFoundPage} />
      </Switch>
    </QueryClientProvider>
  );
}

export default App;
