import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Calculator from "@/pages/Calculator";
import RestrictedAccess from "@/pages/RestrictedAccess";

function isNativeApp(): boolean {
  const userAgent = navigator.userAgent || '';
  const isReactNative = userAgent.includes('ReactNative') || 
                        userAgent.includes('Expo') ||
                        userAgent.includes('ExpoClient');
  const isWebView = userAgent.includes('wv') || 
                    userAgent.includes('WebView');
  const hasReactNativeGlobal = typeof (window as any).ReactNativeWebView !== 'undefined';
  
  return isReactNative || isWebView || hasReactNativeGlobal;
}

function Router() {
  if (!isNativeApp()) {
    return <RestrictedAccess />;
  }

  return (
    <Switch>
      <Route path="/" component={Calculator} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
