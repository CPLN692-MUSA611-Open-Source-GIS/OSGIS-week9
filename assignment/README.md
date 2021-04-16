# Building an interactive map with a chart component

Today, your task is to construct a choropleth map (recall the trash collection map we produced) as well as two corresponding charts which will update as users click on different polygons.
Data has been collected containing vaccination statistics (full and partial vaccination counts) per zipcode within Philadelphia.
These vaccination numbers will be used to construct a very simple bar chart in which complete and partial vaccinations are the only two bars.
The second chart will be a pie chart.
It will illustrate the portion of the population vaccinated (both partially and to completeness) vs. the portion of the population that has not been vaccinated at all.

### Setup
 
 This time, there's no skeletal project structure provided. Write it yourself or copy and paste as necessary to get a map on your screen.
 Be sure to leave room for charts and some descriptive text in a panel separate from your map.


### Plot Zipcode Polygons //done

Once you've got a functional leaflet map in place, it is time to plot the polygons which are associated with zip codes.
Get the geojson [here](https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/Zipcodes_Poly.geojson)


### Load the vaccination by zip code lookup table //done

A CSV was downloaded from https://www.opendataphilly.org/.
It was then converted to json and added to this week's repo under the filename `vaccination_by_zip.json`.
Use ajax to read this data into a variable which you will use to find values which correspond to a clicked zipcode polygon. //vaccineData


### Add a 'click' event handler //done

We want the polygons to cause changes in behavior whenever they're clicked.
For now, implement a click handling function which logs to the console the clicked polygon's associated zip code. //done
Once you've done that, log associated vaccination statistics. 


### Plot stats to a bar chart //done

> See the [Chart.js homepage](https://www.chartjs.org/docs/latest/) as well as the [getting started page](https://www.chartjs.org/docs/latest/getting-started/) for instructions on implementing your first graph.
> And don't be afraid to copy and paste examples so that y  ou can better experiment with the library!

If stats are logging to the console when a polygon is clicked (as they should be following the prior step), add a [bar chart](https://www.chartjs.org/docs/latest/charts/bar.html) with one bar corresponding to partially vaccinated people and one bar corresponding to fully vaccinated people.


### Represent population statistics by zip code //done

In addition to the (not entirely useful) bar charts generated in the previous step, we want to include some data with a bit more context.
Find population statistics per zip code in philadelphia and construct a lookup table that will allow you to find a population provided a zip code.
Such numbers should be easy enough to track down with a bit of googling.


### Plot population percentage stats to a chart //done

At this point, we have everything necessary to construct a meaningful pie/doughnut chart per polygon/zipcode on the map.
Near the bar chart produced above (the exact location on your page is up to you), create a pie chart with fields for unvaccinated population, fully vaccinated population, and partially vaccinated population.
Don't forget to subtract fully and partially vaccinated counts from the population numbers to derive your 'unvaccinated' count.


### Style the polygons //done

Calculate the percent of the population that is vaccinated and use those numbers to style your polygons.
Scale either the opacity or the color (perhaps using [chroma.js](https://gka.github.io/chroma.js/)) based on the percent of the population that has been vaccinated.
Adjust your choropleth scale as necessary to ensure polygons remain visible.
