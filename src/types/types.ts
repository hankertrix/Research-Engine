// The various types to use in the research engine

// The router interface so that the router can be passed to the components
export interface Router {
  push: (url: string) => void
};