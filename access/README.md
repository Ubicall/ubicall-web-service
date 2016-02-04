 **aggregation pseudo code**

```pseudo

startDate <- start date of current hour (i.e 2016-02-04T08:00:00Z)
endDate <- end date of current hour (i.e 2016-02-04T08:59:59.999Z)


get progress aggregation between with startDate and endDate
  if exist && completed
    stop with message "already aggregated"
  else:
    aggregate
    
aggregate in date:
  add/update a progress [start - end - state]
    then
      get changed licence_keys, categories from start-end
        then
          foreach licence_key
            ensure report created for licence_key and it's categories
              then
                foreach category
                  update report by adding count to report with same hour of startDate
                  count <- sum of all hourly fields
              then
                update a progress state to completed
    otherwise
      update a progress state to failed  

```
