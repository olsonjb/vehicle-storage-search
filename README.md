# Multi-Vehicle Search
The instructions for this challenge can be found in the `challenge_description.md` file. The solution is deployed and can be verified by sending a post request
with the format described in the challenge instructions to https://jacobolson-vehicle-sto-50.deno.dev/
## Challenges
This was an interesting variation of the bin-packing problem because of the additional problem dimensions that needed to be considered:
- The storage spaces were two dimensional, with both a width and a length
- The width and length for each storage space were unique
- The solution needed to find the best price
## Approach
My solution used a variation of the descending first fit algorithm, attempting to fit the largest vehicles into the storage spaces first followed by the smaller vehicles
to optimize the number of bins used. I divided each storage space into "lanes" with widths equal to the width of the vehicles, and each lane essentially each functioned as a separate bin.
I also sorted the storage spaces in ascending price order, attempting to fill the cheapest storage spaces first in order to minimize the total cost of the storage space.
I recognize that this greedy approach is not always optimal, as a single more expensive storage space may be cheaper than combining multiple cheap storage spaces,
but I felt this solution was the most straightforward, with the clearest path to implemention in the time available.

## Time utilized
~2 hours and 40 minutes
