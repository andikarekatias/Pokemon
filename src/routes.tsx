import { createRootRoute, createRoute } from "@tanstack/react-router";
import IndexPage from "./App";
import Navbar from "./components/navbar";
import PokemonDetail from "./Pokemon";

const rootRoute = createRootRoute({
  component: () => <Navbar />,
});

type PokemonSearch = {
  page: number;
  name: string;
};

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <IndexPage />,
  validateSearch: (search: Record<string, unknown>): PokemonSearch => {
    return {
      page: Number(search.page ?? 1),
      name: String(search.name ?? ""),
    };
  },
});

const pokemonDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/pokemon/$pokemonName",
    component: () => <PokemonDetail/>
})

export const routeTree = rootRoute.addChildren([indexRoute, pokemonDetailRoute]);
