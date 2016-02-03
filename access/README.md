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
                foreach category
                  if (startDate and endDate have same hour)
                    count <- get count of logs with licence_key, category, start, end dates
                    update report by adding count to report with same hour of startDate
                  else
                    start_count <- get count of logs with licence_key, category, start, end of start hour
                    update report by adding start_count to report with same hour of startDate
                    end_count <- get count of logs with licence_key, category, end of start hour, end
                    update report by adding end_count to report with same hour of endDate
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
