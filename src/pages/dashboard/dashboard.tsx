import React, { useEffect, useState } from 'react';
import { app } from '@config/firebase';
import { getAuth } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { CombinedStates } from '@store/reducers/custom';
import { useNavigate } from 'react-router-dom';
import { routes } from '@src/router/routes';
import Sidebar from '@components/sidebar/sidebar';
import { dialog } from '@tauri-apps/api';
import { Card } from 'react-bootstrap';
import { PieChart } from 'react-minimal-pie-chart';
import { useLoading } from '@pages/loading/loading';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { appendLoading, removeLoading } = useLoading();
    const auth = useSelector<CombinedStates>((state) => state.generalReducer.auth) as any;
    const [loaded, setLoaded] = useState(false);
    const [appStoreSales, setAppStoreSales] = useState(0);
    const [playStoreSales, setPlayStoreSales] = useState(0);

    useEffect(() => {
        if (auth) {
            //Fetch data
            appendLoading();
            fetchDashboard();
        } else {
            navigate(routes.LOGIN);
        }
    }, [getAuth(app).currentUser]);

    async function fetchDashboard(): Promise<void> {
        try {
            //TODO: Fetch dashboard data
            calculateSalesDistribution();
            setLoaded(true);
            removeLoading();
        } catch (error: any) {
            dialog.message(error.message);
            removeLoading();
        }
    }

    function calculateSalesDistribution(): any {
        //TODO: Fetch AppStore sales;
        //TODO: Fetch GooglePlay sales;
        //! Dummy data
        const x = 2000;
        const y = 3980;
        const total = 5980;
        setAppStoreSales(Math.round((x * 100) / total));
        setPlayStoreSales(Math.round((y * 100) / total));
    }

    function displayPage(): JSX.Element {
        if (loaded) {
            return (
                <div className="page" id="page-upload-edit">
                    <Sidebar />
                    <div className="page-content">
                        <h2 className="page-title">Dashboard</h2>
                        <h3 style={{ color: 'black' }}>General</h3>
                        <div className="dashboard-cards">
                            <Card className="card">
                                {/* <Card.Img variant="top" src={Icons.AudioIcon} /> */}
                                <Card.Body className="card-body">
                                    <Card.Title style={{ fontSize: '20px', color: '#00ffff' }}>Resources</Card.Title>
                                    <Card.Text>Albums: 100</Card.Text>
                                    <Card.Text>Songs: 100</Card.Text>
                                    <Card.Text>Samples: 100</Card.Text>
                                    <Card.Text>Presets: 100</Card.Text>
                                </Card.Body>
                            </Card>
                            <Card className="card" style={{ marginLeft: '20px' }}>
                                {/* <Card.Img variant="top" src={Icons.AudioIcon} /> */}
                                <Card.Body className="card-body">
                                    <Card.Title style={{ fontSize: '20px', color: '#00ffff' }}>Categories</Card.Title>
                                    <Card.Text>Albums: 100</Card.Text>
                                    <Card.Text>Samples: 100</Card.Text>
                                    <Card.Text>Presets: 100</Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                        <h3 style={{ color: 'black' }}>Sales</h3>
                        <div className="dashboard-sales">
                            <PieChart
                                animate={true}
                                data={[
                                    { title: 'AppStore', value: appStoreSales, color: '#F5F5F7', key: '100' },
                                    { title: 'GooglePlay', value: playStoreSales, color: '#48FF48' },
                                ]}
                                // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                                label={({ dataEntry }) => dataEntry.percentage + '%'}
                            />
                            <div className="dashboard-cards">
                                <Card className="card sales-apple-card">
                                    <Card.Body className="card-body">
                                        <Card.Title style={{ fontSize: '20px', color: '#000000' }}>
                                            AppStore sales
                                        </Card.Title>
                                        <Card.Text>Total revenue: 100</Card.Text>
                                        <Card.Text>Yearly income: 100</Card.Text>
                                        <Card.Text>Monthly income: 100</Card.Text>
                                        <Card.Text>Delta last month: 100</Card.Text>
                                    </Card.Body>
                                </Card>
                                <Card className="card sales-android-card">
                                    <Card.Body className="card-body">
                                        <Card.Title style={{ fontSize: '20px', color: '#000000' }}>
                                            GooglePlay sales
                                        </Card.Title>
                                        <Card.Text>Total revenue: 100</Card.Text>
                                        <Card.Text>Yearly income: 100</Card.Text>
                                        <Card.Text>Monthly income: 100</Card.Text>
                                        <Card.Text>Delta last month: 100</Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <div></div>;
        }
    }

    return displayPage();
};

export default Dashboard;
