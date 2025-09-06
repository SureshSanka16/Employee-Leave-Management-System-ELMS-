import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import BackendURLS from '../config';
import { Spinner } from '@nextui-org/react';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function LeaveAnalysis() {
    const [analysis, setAnalysis] = useState(null);

    const fetchAnalysis = async (ID) => {
        try {
            const response = await axios.get(`${BackendURLS.Employee}/leaveAnalysis/${ID}`, {
                headers: {
                    Authorization: sessionStorage.getItem('EmployeeToken')
                }
            });
            setAnalysis(response.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        const ID = JSON.parse(sessionStorage.getItem('employee')).EmployeeID;
        fetchAnalysis(ID);
    }, []);

    const renderChart = () => {
        if (!analysis) {
            return (
                <div align="center" className='spinner'>
                    <Spinner size='lg' color="warning" label='Loading Analysis...' />
                </div>
            );
        }

        const { LeaveCountDayByDay, CasualLeaveCount, MaternityLeaveCount, MedicalLeaveCount, HalfPaidLeaveLeaveCount, CompensatedCasualLeaveCount, SickLeaveCount } = analysis;

        // Pie chart data for LeaveType
        const typePieDataPoints = [
            { y: CasualLeaveCount, name: 'Casual Leave' },
            { y: MaternityLeaveCount, name: 'Maternity Leave' },
            { y: MedicalLeaveCount, name: 'Medical Leave' },
            { y: HalfPaidLeaveLeaveCount, name: 'Half-Paid Leave' },
            { y: CompensatedCasualLeaveCount, name: 'Compensated Casual Leave' },
            { y: SickLeaveCount, name: 'Sick Leave' }
        ];

        // Scatter chart data for LeaveCount vs Date
        const scatterDataPoints = LeaveCountDayByDay ? LeaveCountDayByDay.map(data => ({
            x: new Date(data._id),
            y: data.count
        })).sort((a, b) => a.x - b.x) : [];

        const predefinedColors = ["red", "blue", "green", "orange", "purple", "yellow", "cyan", "magenta", "lime", "pink"];

        const typePieOptions = {
            animationEnabled: true,
            exportEnabled: true,
            title: {
                text: "Leave Types"
            },
            data: [{
                type: "pie",
                showInLegend: true,
                toolTipContent: "{name}: <strong>{y}</strong>",
                indexLabel: "{name} - {y}",
                dataPoints: typePieDataPoints
            }]
        };

        const scatterOptions = {
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "Leave Count vs Date"
            },
            axisX: {
                title: "Date",
                valueFormatString: "DD MMM YYYY"
            },
            axisY: {
                title: "Leave Count"
            },
            data: [{
                type: "line",
                markerType: "circle",
                markerSize: 10,
                toolTipContent: "<b>Date:</b> {x}<br/><b>Leave Count:</b> {y}",
                dataPoints: scatterDataPoints.map((point, index) => ({
                    ...point,
                    color: predefinedColors[index % predefinedColors.length]
                }))
            }]
        };

        return (
            <div>
                <h1 className="headingleave mt-10" align="center">Your Leave Analysis</h1>
                <div className="leaveAnalysisContainer mt-6" style={{ zIndex: -1 }}>
                    <div style={{ display: "inline-block", width: "50%" }}>
                        <CanvasJSChart options={typePieOptions} />
                    </div>
                    <div style={{ display: "inline-block", width: "50%" }}>
                        {scatterDataPoints.length > 0 ? (
                            <CanvasJSChart options={scatterOptions} />
                        ) : (
                            <p>No data available for scatter chart</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='m-4'>
            {renderChart()}
        </div>
    );
}
