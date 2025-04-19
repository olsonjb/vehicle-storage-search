import unorderedListings from "./listings.json" with { type: "json" };

const VEHICLE_WIDTH = 10;

type Listing = typeof unorderedListings[number];

interface VehicleBatch {
    length: number;
    quantity: number;
}

interface Vehicle {
    length: number;
    width: number;
}

interface ResponseLocation {
    location_id: string;
    listing_ids: string[];
    total_price_in_cents: number;
}

const locationMap = unorderedListings.reduce((acc, listing) => {
    acc[listing.location_id] = [...(acc[listing.location_id] ?? []), listing];
    return acc;
}, {} as Record<string, Listing[]>);

export function searchLocations(vehicles: Vehicle[]) {
    const validLocations: ResponseLocation[] = [];

    // sort vehicles by length descending to store the largest vehicles first
    vehicles.sort((a, b) => b.length - a.length);

    // check each location
    for (const [locationId, listings] of Object.entries(locationMap)) {
        // sort listings by price ascending to store in the cheapest listings first
        listings.sort((a, b) => a.price_in_cents - b.price_in_cents);

        const vehiclesLeft = [...vehicles];
        const listingsNeeded = [];

        // fit the vehicles into the listings - start with the cheapest to try to minimize the total price
        for (const listing of listings) {
            // split into lanes to handle storing the vehicles side by side
            const lanes = new Array(listing.width / VEHICLE_WIDTH).fill(listing.length);

            // try to fit the vehicles into the lanes
            const numStartVehicles = vehiclesLeft.length;
            for (const vehicle of vehiclesLeft) {
                for (let i = 0; i < lanes.length; i++) {
                    if (lanes[i] >= vehicle.length) {
                        lanes[i] -= vehicle.length;
                        vehiclesLeft.splice(vehiclesLeft.indexOf(vehicle), 1);
                        break;
                    }
                }
            }
            const numEndVehicles = vehiclesLeft.length;
            if (numEndVehicles !== numStartVehicles) {
                // we put a vehicle in this listing
                listingsNeeded.push(listing);
            }
            if (vehiclesLeft.length === 0) {
                // no more vehicles to store at this location
                break;
            }
        }

        // if we have no vehicles left this location is valid because we were able to store them all
        if (vehiclesLeft.length === 0) {
            validLocations.push({
                location_id: locationId,
                listing_ids: listingsNeeded.map((listing) => listing.id),
                total_price_in_cents: listingsNeeded.reduce((acc, listing) => acc + listing.price_in_cents, 0),
            });
        }
    }

    // return the valid locations sorted by price ascending
    return validLocations.toSorted((a, b) => a.total_price_in_cents - b.total_price_in_cents);
}

/** Flatten a list of vehicle batches into a list of vehicles */
export function getVehicles(batches: VehicleBatch[]) {
    const vehicles: Vehicle[] = [];

    for (const batch of batches) {
        for (let i = 0; i < batch.quantity; i++) {
            vehicles.push({
                length: batch.length,
                width: VEHICLE_WIDTH,
            });
        }
    }

    return vehicles;
}
