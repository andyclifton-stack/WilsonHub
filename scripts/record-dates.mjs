export const dateFields=['created','firstSeen','lastChecked','lastUpdated']

export const currentUtcDate=()=>new Date().toISOString().slice(0,10)

export function validateRecordDates(record,validationDate=currentUtcDate()){
  const errors=[]
  for(const field of dateFields){
    const value=record[field]
    if(Number.isNaN(Date.parse(`${value}T00:00:00Z`)))errors.push(`${record.id}.${field} is not a valid date`)
    if(value > validationDate)errors.push(`${record.id}.${field} date ${value} is later than current validation date ${validationDate}`)
  }
  return errors
}
