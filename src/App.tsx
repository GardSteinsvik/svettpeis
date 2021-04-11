import StoreProviider from './store/Store'
import styles from './App.module.css'
import TcxViewer from './components/TcxViewer/TcxViewer';
import TcxUpload from './components/TcxUpload/TcxUpload';
import PushPin from './components/PushPin/PushPin'

function App() {
    return (
        <StoreProviider>
            <div className={styles.root}>
                <div className={[styles.card, 'shadow'].join(' ')}>
                    <PushPin/>
                    <h1>SVETTPEIS</h1>
                    <h2>.TCX ANALYZER</h2>
                </div>
                <TcxUpload/>
                <TcxViewer/>
            </div>
        </StoreProviider>
    );
}

export default App;