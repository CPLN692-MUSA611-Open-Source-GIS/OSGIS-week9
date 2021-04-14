library(dplyr)
library(rjson)

allPop <- read.csv('us_pop_by_zipcode.csv') %>% 
  select(Geo_ZCTA5, SE_A00001_001) %>%
         mutate(zipcode = case_when(
    nchar(Geo_ZCTA5) == 3 ~ paste('00',Geo_ZCTA5,sep = ""),
    nchar(Geo_ZCTA5) == 4 ~ paste('0',as.character(Geo_ZCTA5),sep = ""),
    nchar(Geo_ZCTA5) == 5 ~ as.character(Geo_ZCTA5)
    )
  ) %>% select(zipcode, Population=SE_A00001_001)


