import { EventInterface } from '@sports-alliance/sports-lib/lib/events/event.interface'
import { format } from 'date-fns'
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion"
import React from "react"
import useDisclosure from '../../hooks/useDisclosure'
import { useTcxContext } from "../../store/Store"
import styles from './TcxViewer.module.css'
import PushPin from '../PushPin/PushPin'
import {CadenceIcon, CyclingIcon, DistanceIcon, EnergyIcon, HearRateIcon, PowerIcon, RunningIcon, TimeIcon} from './icons'
import LineChart from '../LineChart/LineChart'
import { Types } from '../LineChart/types'

export default function TcxViewer() {
    const { state } = useTcxContext()

    return (
        <AnimateSharedLayout>
            <div className={[styles.card, 'shadow'].join(' ')}>
                <motion.ul>
                    <PushPin />
                    {state.tcxEvents.map(tcxEvent => (
                        <Card key={tcxEvent.startDate.toISOString()} tcxEvent={tcxEvent} />
                    ))}
                </motion.ul>
            </div>
        </AnimateSharedLayout>
    )
}

function Card({ tcxEvent }: { tcxEvent: EventInterface }) {
    const { isOpen, onToggle } = useDisclosure()

    const stats = tcxEvent.getStats()
    const activityTypes = stats.get("Activity Types")?.getValue() as string[] || []
    const activityString = activityTypes.join(', ').toUpperCase()
    let activityIcon = HearRateIcon
    if (activityString.indexOf('CYCLING') !== -1) activityIcon = CyclingIcon
    if (activityString.indexOf('RUNNING') !== -1) activityIcon = RunningIcon

    return (
        <motion.li layout onClick={onToggle} initial={{ borderRadius: 10, scale: 0 }} animate={{ borderRadius: 10, scale: 1 }}>
            <motion.div layout className={styles.header}>
                <motion.div layout>{React.createElement(activityIcon, { className: styles.headerIcon})}</motion.div>
                <motion.div layout className={styles.headerTitleWrapper}>
                    <motion.p layout className={styles.headerTitle}>{activityString}</motion.p>
                    <motion.p layout>{format(tcxEvent.startDate, 'yyyy-MM-dd HH:mm:ss')}</motion.p>
                </motion.div>
            </motion.div>
            <AnimatePresence>{isOpen && <Content tcxEvent={tcxEvent} />}</AnimatePresence>
        </motion.li>
    )
}

function Content({ tcxEvent }: { tcxEvent: EventInterface }) {

    const stats = tcxEvent.getStats()

    const data = [
        { icon: TimeIcon, type: 'Duration', value: 0, getText: (v: number) => new Date(v * 1000).toISOString().substr(11, 8) },
        { icon: DistanceIcon, type: 'Distance', value: 0, getText: (v: number) => `${Math.round(v / 1e2) / 10} km` },
        { icon: EnergyIcon, type: 'Energy', value: 0, getText: (v: number) => `${v} kcal` },
        { icon: CadenceIcon, type: 'Average Cadence', value: 0, getText: (v: number) => `${Math.round(v)} rpm` },
        { icon: PowerIcon, type: 'Average Power', value: 0, getText: (v: number) => `${Math.round(v)} W` },
        { icon: PowerIcon, type: 'Max Average Power (20 min)', value: 0, getText: (v: number) => `${Math.round(v)} W` },
        { icon: PowerIcon, type: 'Max Average Power (4 min)', value: 0, getText: (v: number) => `${Math.round(v)} W` },
        { icon: HearRateIcon, type: 'Average Heart Rate', value: 0, getText: (v: number) => `${Math.round(v)} bpm` },
        { icon: HearRateIcon, type: 'Minimum Heart Rate', value: 0, getText: (v: number) => `${Math.round(v)} bpm` },
        { icon: HearRateIcon, type: 'Maximum Heart Rate', value: 0, getText: (v: number) => `${Math.round(v)} bpm` },
    ].map(d => ({...d, value: stats.get(d.type)?.getValue() as number ?? 0}))

    const activities = tcxEvent.getActivities()
    const streams = activities[0].getAllStreams()

    const charts = streams.filter(s=>['Cadence', 'Power', 'Altitude', 'Heart Rate', 'Speed'].includes(s.type)).map(stream => {
        const key = stream.type.replace(' ', '') + tcxEvent.getID()
        const data = stream.getData().map((p, i) => ({ date: i * 1000 / 60, value: p })).filter(v => v.value) as Types.Data[]
        return <motion.div key={key} className={styles.chart}><LineChart id={key} title={stream.type} top={20} right={40} bottom={20} left={30} width={360} height={150} fill="var(--prussian-blue)" data={data} /></motion.div>
    })

    return (
        <motion.div
            className={styles.content}
            layout
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
        >
            {data.map(d => (
                <div key={d.type} className={styles.row}>
                    {React.createElement(d.icon, { className: [styles.icon, d.value ? undefined : styles.noValue].join(' ') })}
                    <p className={styles.rowType}>{d.type}:&nbsp;</p>
                    <p className={styles.rowValue}>{d.value ? d.getText(d.value) : '—'}</p>
                </div>
            ))}
            {charts}
            {/* <pre>{JSON.stringify(tcxEvent, undefined, 1)}</pre> */}
        </motion.div>
    )
}
