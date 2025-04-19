import { getVehicles, searchLocations } from "./searchLocations.ts";

Deno.serve(async (req) => {
  const body = await req.json();

  return new Response(JSON.stringify(searchLocations(getVehicles(body))));
});
