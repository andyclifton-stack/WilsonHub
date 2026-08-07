import fs from 'node:fs'
import path from 'node:path'
import Ajv2020 from 'ajv/dist/2020.js'
import {currentUtcDate,validateRecordDates} from './record-dates.mjs'

const root=process.cwd(), dataDir=path.join(root,'public','data')
const files=['vehicle','software','issues','guides','uk-watch','sources','actions','change-log']
const schema=JSON.parse(fs.readFileSync(path.join(root,'schemas','record.schema.json'),'utf8'))
const ajv=new Ajv2020({allErrors:true,strict:false}), validate=ajv.compile(schema)
const records=[], errors=[], validationDate=currentUtcDate()
for(const name of files){
  const file=path.join(dataDir,`${name}.json`)
  try{
    const value=JSON.parse(fs.readFileSync(file,'utf8'))
    if(!Array.isArray(value)){errors.push(`${name}.json must contain an array`);continue}
    value.forEach((record,index)=>{if(!validate(record))errors.push(`${name}.json[${index}] ${ajv.errorsText(validate.errors)}`);records.push({...record,_file:name})})
  }catch(error){errors.push(`${name}.json: ${error.message}`)}
}
try{JSON.parse(fs.readFileSync(path.join(dataDir,'site-meta.json'),'utf8'))}catch(error){errors.push(`site-meta.json: ${error.message}`)}
const ids=new Set()
for(const r of records){if(ids.has(r.id))errors.push(`Duplicate stable ID: ${r.id}`);ids.add(r.id);errors.push(...validateRecordDates(r,validationDate))}
for(const r of records)for(const field of ['sources','related','applicableVehicle','applicableSoftware'])for(const ref of r[field]||[])if(!ids.has(ref))errors.push(`${r.id}.${field} has broken reference: ${ref}`)
if(errors.length){console.error(`Data validation failed (${errors.length}):\n- ${errors.join('\n- ')}`);process.exit(1)}
console.log(`Validated ${records.length} records across ${files.length+1} data files; IDs and internal references are sound.`)
