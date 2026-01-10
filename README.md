# MissionControl

A cross-platform spacecraft mission control simulator implemented with Tauri, React, and D3.

## Orbit Propagator and Initial Conditions

The orbit propagator for this project is a rough n-body discrete Newtonian model, supporting all bodies added to the config file plus the Earth (mandatory). All data is stored internally in ECI J2000 cartesian coordinates. Starting numbers are generated using the Skyfield python library and the NASA JPL development ephemeris `de440s`, issued in 2020 and valid for dates 1849-2150 (found at the [NASA PDS Navigation Node](https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/planets/) and stored locally for version control). The default output of skyfield's observers can be used as it is stored in ICRS, as noted in the Skyfield documentation:

> Even though Skyfield scripts often produce output in spherical coordinates — like right ascension and declination, or altitude and azimuth — Skyfield always stores positions internally as Cartesian (x,y,z) vectors oriented along the axes of the International Celestial Reference System (ICRS).
> <br>...<br>
> The ICRS is a higher-accuracy replacement for the old J2000 reference system. It’s defined using the positions of very distant quasars, so its precision can improve each decade as radio telescopes measure quasar positions ever more accurately.
> <br>...<br>
> The ICRS axes are within 0.02 arcseconds of the old J2000 axes, so many scripts simply treat J2000 coordinates as modern ICRS coordinates.

To generate state vectors from the python command line:

```python
from skyfield.api import load

planets = load('de440s.bsp')
print(planets)
# SPICE kernel file 'de440s.bsp' has 14 segments
#   JD 2396752.50 - JD 2506352.50  (1849-12-25 through 2150-01-21)
#       0 -> 1    SOLAR SYSTEM BARYCENTER -> MERCURY BARYCENTER
#       0 -> 2    SOLAR SYSTEM BARYCENTER -> VENUS BARYCENTER
#       0 -> 3    SOLAR SYSTEM BARYCENTER -> EARTH BARYCENTER
#       0 -> 4    SOLAR SYSTEM BARYCENTER -> MARS BARYCENTER
#       0 -> 5    SOLAR SYSTEM BARYCENTER -> JUPITER BARYCENTER
#       0 -> 6    SOLAR SYSTEM BARYCENTER -> SATURN BARYCENTER
#       0 -> 7    SOLAR SYSTEM BARYCENTER -> URANUS BARYCENTER
#       0 -> 8    SOLAR SYSTEM BARYCENTER -> NEPTUNE BARYCENTER
#       0 -> 9    SOLAR SYSTEM BARYCENTER -> PLUTO BARYCENTER
#       0 -> 10   SOLAR SYSTEM BARYCENTER -> SUN
#       3 -> 301  EARTH BARYCENTER -> MOON
#       3 -> 399  EARTH BARYCENTER -> EARTH
#       1 -> 199  MERCURY BARYCENTER -> MERCURY
#       2 -> 299  VENUS BARYCENTER -> VENUS
sun = planets['sun']
earth = planets['earth']
moon = planets['moon']

t = load.timescale().utc(2000) # J2000 epoch numbers shown below, substitute for desired date

print(earth.at(t).observe(sun).xyz.km)              # [2.52128392e+07 -1.32968699e+08 -5.76483146e+07]
print(earth.at(t).observe(sun).velocity.km_per_s)   # [29.83976734 4.77829212 2.07157574]
print(earth.at(t).observe(moon).xyz.km)             # [-317575.10336463 -236504.22146683 -62693.60375344]
print(earth.at(t).observe(moon).velocity.km_per_s)  # [ 0.56091175 -0.73317161 -0.31967135]
# ...
```
