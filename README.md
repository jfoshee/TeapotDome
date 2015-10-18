# TeapotDome

Check out the [2D survey map](./2DNavigationLinesA-E.geojson)

## Attribution

Data is courtesy of RMOTC and the U.S. Department of Energy

## Notes

### Environment

- git
- git-lfs
- npm




### LFS

Install [git LFS client](https://git-lfs.github.com)

Associate SEG-Y files with large file storage

`git lfs track "*.sgy" "*.segy" "*.pdf"`


### GIS

<https://epsg.io/32056>

    H Active Project Name: C:\GGraphix_Projects\NPR-3
    H Coordinate System: SPCS27 - Wyoming East Central  Datum:  NAD 1927 -  North America Datum of 1927 (Mean)
    H Data Coordinate System Units: U.S. Survey Feet
    H Project Measurement Units: Feet.

WYOMING EAST CENTRAL ZONE FIPSZONE: 4902 ADSZONE: 5801 UTM ZONE: 13

Expect something like: 
804635, 935826 -> 42.1527484°, -109.2056781°
(via http://www.earthpoint.us/StatePlane.aspx)
