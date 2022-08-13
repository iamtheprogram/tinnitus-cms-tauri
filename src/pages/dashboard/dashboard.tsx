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
import MostRatedView from '@components/mostratedview/mostratedview';

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

    // async function fetchUsersData(): Promise<> {

    // }

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
                <div className="page" id="page-upload-edit" style={{ overflowY: 'auto' }}>
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
                        <h3 style={{ color: 'black' }}>Users & Activity</h3>
                        <div className="dashboard-usr-div">
                            <div className="dasboard-users">
                                <div className="dashboard-user-table">
                                    <UsersTable
                                        headers={['Key', 'Value', 'Description']}
                                        rows={[
                                            {
                                                key: 'Users',
                                                value: 7000,
                                                desc: 'Total number of users who created an account',
                                            },
                                            {
                                                key: 'Users Email',
                                                value: 2000,
                                                desc: 'Total number of users registered via email',
                                            },
                                            {
                                                key: 'Users Apple',
                                                value: 2000,
                                                desc: 'Total number of users registered with "Apple Sign In"',
                                            },
                                            {
                                                key: 'Users Google',
                                                value: 3000,
                                                desc: 'Total number of users registered with "Google Sign In"',
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                            <div className="dashboard-user-activity">
                                <div className="dashboard-user-table">
                                    <UsersTable
                                        headers={['Key', 'Value', 'Description']}
                                        rows={[
                                            {
                                                key: 'Views',
                                                value: 123436905,
                                                desc: 'Total number of reviews',
                                            },
                                            {
                                                key: 'Likes',
                                                value: 43667,
                                                desc: 'Total number of reviews',
                                            },
                                            {
                                                key: 'Favourites',
                                                value: 3587,
                                                desc: 'Total number of reviews',
                                            },
                                            {
                                                key: 'Reviews',
                                                value: 678452,
                                                desc: 'Total number of reviews',
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                        <h3 style={{ color: 'black' }}>Most rated</h3>
                        <div className="dashboard-most-rated">
                            <MostRatedView />
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

interface UsersTableProps {
    headers: string[];
    rows: { key: string; value: number; desc: string }[];
}

const UsersTable: React.FC<UsersTableProps> = (props: UsersTableProps) => {
    return (
        <table>
            <thead>
                <tr>
                    {props.headers.map((header) => (
                        <th>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {props.rows.map((row) => (
                    <tr>
                        <td>{row.key}</td>
                        <td>{row.value}</td>
                        <td className="desc-td">{row.desc}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Dashboard;

/** <tr>
                    <td>Users</td>
                    <td>5000</td>
                    <td className="desc-td">Total number of users who created an account</td>
                </tr>
                <tr>
                    <td>Users_Email</td>
                    <td>3000</td>
                    <td className="desc-td">Total number of users registered via email</td>
                </tr>
                <tr>
                    <td>Users_Apple</td>
                    <td>800</td>
                    <td className="desc-td">Total number of users registered with "Apple Sign In"</td>
                </tr>
                <tr>
                    <td>Users_Google</td>
                    <td>2200</td>
                    <td className="desc-td">Total number of users registered with "Google Sign In"</td>
                </tr>
                <tr>
                    <td>Users_Current</td>
                    <td>4800</td>
                    <td className="desc-td">Total number of active users</td>
                </tr>
                <tr>
                    <td>Users_Subscribed_Total</td>
                    <td>2000</td>
                    <td className="desc-td">
                        Total number of users who subscribed since the launch of the application
                    </td>
                </tr>
                <tr>
                    <td>Users_Subscribed_Current</td>
                    <td>4000</td>
                    <td className="desc-td">Total number of active subscribers</td>
                </tr> */
