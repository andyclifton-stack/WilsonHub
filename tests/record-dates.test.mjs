import test from 'node:test'
import assert from 'node:assert/strict'
import {currentUtcDate,validateRecordDates} from '../scripts/record-dates.mjs'

const recordWithDates=(date)=>({id:'test-record',created:date,firstSeen:date,lastChecked:date,lastUpdated:date})

test('today in UTC is accepted',()=>{
  const today=currentUtcDate()
  assert.deepEqual(validateRecordDates(recordWithDates(today),today),[])
})

test('a future date is rejected with both dates in the error',()=>{
  const today=currentUtcDate()
  const future=new Date(`${today}T00:00:00Z`)
  future.setUTCDate(future.getUTCDate()+1)
  const futureDate=future.toISOString().slice(0,10)
  const record=recordWithDates(today)
  record.lastUpdated=futureDate
  assert.deepEqual(validateRecordDates(record,today),[
    `test-record.lastUpdated date ${futureDate} is later than current validation date ${today}`
  ])
})

test('invalid dates continue to be rejected',()=>{
  const record=recordWithDates(currentUtcDate())
  record.created='not-a-date'
  assert.ok(validateRecordDates(record).includes('test-record.created is not a valid date'))
})
