// The various types to use in the research engine

// The router interface so that the router can be passed to the components
interface Router {
  push: (url: string) => void
};

// Export the useRouter function type
export type useRouter = () => Router;
