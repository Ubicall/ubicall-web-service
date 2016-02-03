 **aggregation pseudo code**

```pseudo

aggregate:
  add/update a progress [start - end - state]
    then
      get changed licence_keys, categories from start-end
        then
          foreach licence_key
            ensure report created for licence_key and it's categories
              then
                  update report count with category/licence_key count
                    then
                      foreach category
                        update report by adding count to report with same hour of startDate
                      then
                        update a progress state to completed
                      otherwise
                        update a progress state to failed  

make sure end date belong to same hour of start date
  false:
    endDate will be last minute of startDate hour
get progress aggregation between start-end
  if exist && all completed
    stop with message "already aggregated"
  if exist && some failed
    foreach failed
      aggregate
  else:
    aggregate
```
