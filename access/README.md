 **aggregation pseudo code**

```pseudo

startDate <- start date of current hour (i.e 2016-02-04T08:00:00Z)
endDate <- end date of current hour (i.e 2016-02-04T08:59:59.999Z)


get progress aggregation between with startDate and endDate
  if running or (completed and `now is not Between startDate - endDate` )
    stop with message "no need to run, already aggregated"
  else:
    aggregate
    
aggregate in date:
  add/update a progress with startDate, endDate and state `running`
    then
      categories <- changes between startDate and endDate as [{licence_key, category, count}]
        then
          foreach category: categories
            ensure report exist with
              report.category <- category.name
              report.licence_key <- category.licence_key
              then
                update report
                  report.hourly[startDate.hour] <- category.count
                  report.count <- sum of all hourly fields
              then
                update a progress state to completed
    otherwise
      update a progress state to failed  

```
