import styles from './PushPin.module.css'

export default function PushPin({color}:{color?: 'red'|'blue'}) {
    const classes = [styles.pushPin]
    if (color === 'red') {
        classes.push(styles.red)
    }
    return <div className={classes.join(' ')} />
}