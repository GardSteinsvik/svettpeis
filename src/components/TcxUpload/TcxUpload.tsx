import { useTcxContext } from "../../store/Store"
import {DOMParser} from "xmldom"
import {SportsLib} from '@sports-alliance/sports-lib'
import { ActionType } from "../../store/reducers/tcxReducer"
import { EventInterface } from "@sports-alliance/sports-lib/lib/events/event.interface"
import { DataMaxAvgPower20Min } from "../../types/data.max-avg-power-20-min"
import { useState } from "react"
import "./TcxUpload.css"
import { DataMaxAvgPower4Min } from '../../types/data.max-avg-power-4-min'
import PushPin from '../PushPin/PushPin'

export default function TcxUpload() {
    const {dispatch} = useTcxContext()
    const parser = new DOMParser()

    const [fileCount, setFileCount] = useState(0)

    async function handleFiles(files: FileList | null) {
        setFileCount(files?.length ?? 0)
        if (dispatch && files && files.length > 0) {
            dispatch({type: ActionType.CLEAR_TCX})
            for await (const file of files) {
                const tcxString = await file.text()
                const doc = parser.parseFromString(tcxString)
                const event: EventInterface = await SportsLib.importFromTCX(doc);
                const processedEvent = processEvent(event)
                dispatch({type: ActionType.ADD_TCX_EVENT, payload: processedEvent})
            }
        }
    }

    return (
        <div className="card shadow">
            <PushPin color="red"/>
            <input
                type="file"
                name="file-5"
                id="file-5"
                className="inputfile inputfile-5"
                data-multiple-caption={`${fileCount} files selected`}
                accept={'.tcx'}
                multiple={true}
                onChange={e => handleFiles(e.target.files)}
            />
			<label htmlFor="file-5">
                <figure><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></figure>
                <span>{fileCount ? `${fileCount} .tcx file${fileCount > 1 ? 's' : ''} selected` : `Choose .tcx files...`}</span>
            </label>	
        </div>
    )
}

function processEvent(event: EventInterface): EventInterface {
    event.setID(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5))
    
    const activities = event.getActivities()
    const streams = activities[0].getAllStreams()

    const powerStream = streams.find(s => s.type === 'Power')
    const powerArray = powerStream?.getData() ?? []

    event.addStat(new DataMaxAvgPower20Min(rollingAverage(powerArray, 20*60)))
    event.addStat(new DataMaxAvgPower4Min(rollingAverage(powerArray, 4*60)))
    return event
}

function rollingAverage(dataArray: (number | null)[], duration: number): number {
    const averageCandidates = []

    for (let index = 0; index < dataArray.length - duration; index++) {
        const powerWindow = dataArray.slice(index, index + duration).filter(value => value !== null) as (number)[]
        const averageInWindow = powerWindow.reduce((a, b) => a + b, 0) / (powerWindow.length || 1)
        averageCandidates.push(averageInWindow)
    }

    return Math.max(...averageCandidates, 0)
}