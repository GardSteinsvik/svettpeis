import React, { useEffect } from 'react'
import styles from './LineChart.module.css'
import * as d3 from 'd3'
import { Types } from './types'

const LineChart = (props: IBasicLineChartProps) => {
    const { data } = props
    useEffect(() => {
        draw()
    })

    const draw = () => {
        const width = props.width - props.left - props.right
        const height = props.height - props.top - props.bottom
        const svg = d3
            .select(`#${props.id}`)
            .append('svg')
            .attr('width', width + props.left + props.right)
            .attr('height', height + props.top + props.bottom)
            .append('g')
            .attr('transform', `translate(${props.left},${props.top})`)

        const x = d3
            .scaleTime()
            .domain(d3.extent(data, (d) => d.date) as [number, number])
            .range([0, width])
        svg.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x))
        Math.max(...data.map((dt) => ((dt as unknown) as Types.Data).value), 0)
        const y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(data, (d) => {
                    return Math.max(...data.map((dt) => ((dt as unknown) as Types.Data).value), 0)
                }),
            ] as number[])
            .range([height, 0])
        svg.append('g').call(d3.axisLeft(y))
        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', props.fill)
            .attr('stroke-width', 1)
            .attr(
                'd',
                // @ts-ignore
                d3
                    .line()
                    .x((d) => {
                        return x(((d as unknown) as { date: number }).date)
                    })
                    .y((d) => {
                        return y(((d as unknown) as Types.Data).value)
                    })
            )
    }
    return <div id={`${props.id}`} className={styles.lineChart}><span className={styles.title}>{props.title}</span></div>
}

interface IBasicLineChartProps {
    id: string
    title: string
    width: number
    height: number
    top: number
    right: number
    bottom: number
    left: number
    fill: string
    data: Types.Data[]
}

export default LineChart