import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import BackendURLS from '../config';
import { Spinner } from '@nextui-org/react';
// import './LeaveAnalysis.css'; // Import CSS file
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function LeaveAnalysis() {
    const [analysis, setAnalysis] = useState(null);
    
    const fetchAnalysis = async () => {
        try {
            const response = await axios.get(`${BackendURLS.Admin}/leaveAnalysis`, {
                headers: {
                    Authorization: sessionStorage.getItem('AdminToken')
                }
            });
            console.log("Analysis data:", response.data);
            setAnalysis(response.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        fetchAnalysis();
    }, []);

    const renderChart = () => {
        if (!analysis) return (
            <div align="center" className='spinner'>
                <Spinner size='lg' color="warning" label='Loading Analysis.....' />
            </div>
        );

        const {
            EmployeeCount,
            LeaveCount,
            LeavePendingCount,
            LeaveApprovedCount,
            LeaveRejectedCount,
            CasualLeaveCount,
            MaternityLeaveCount,
            MedicalLeaveCount,
            HalfPaidLeaveLeaveCount,
            CompensatedCasualLeaveCount,
            SickLeaveCount,
            LeaveCountDayByDay
        } = analysis;

        const columnDataPoints = [
            { label: 'Employees', y: EmployeeCount },
            { label: 'Total Leaves', y: LeaveCount },
            { label: 'Pending Leaves', y: LeavePendingCount },
            { label: 'Approved Leaves', y: LeaveApprovedCount },
            { label: 'Rejected Leaves', y: LeaveRejectedCount }
        ];

        const typePieDataPoints = [
            { y: CasualLeaveCount, name: 'Casual Leave' },
            { y: MaternityLeaveCount, name: 'Maternity Leave' },
            { y: MedicalLeaveCount, name: 'Medical Leave' },
            { y: HalfPaidLeaveLeaveCount, name: 'Half-Paid Leave' },
            { y: CompensatedCasualLeaveCount, name: 'Compensated Casual Leave' },
            { y: SickLeaveCount, name: 'Sick Leave' }
        ];

        const scatterDataPoints = LeaveCountDayByDay
            ? LeaveCountDayByDay.map(data => ({
                x: new Date(data._id),
                y: data.count
            })).sort((a, b) => a.x - b.x)
            : [];

        const statusPieDataPoints = [
            { y: LeavePendingCount, name: 'Pending Leaves' },
            { y: LeaveApprovedCount, name: 'Approved Leaves' },
            { y: LeaveRejectedCount, name: 'Rejected Leaves' }
        ];

        const columnOptions = {
            animationEnabled: true,
            exportEnabled:true,
            theme: "light2",
            title: { text: "Leave Analysis" },
            axisY: { title: "Count" },
            data: [{ type: "column", dataPoints: columnDataPoints }]
        };

        const typePieOptions = {
            animationEnabled: true,
            exportEnabled:true,
            title: { text: "Leave Types" },
            data: [{
                type: "pie",
                showInLegend: true,
                toolTipContent: "{name}: <strong>{y}</strong>",
                indexLabel: "{name} - {y}",
                dataPoints: typePieDataPoints
            }]
        };

        const statusPieOptions = {
            animationEnabled: true,
            exportEnabled:true,
            title: { text: "Leave Status" },
            data: [{
                type: "pie",
                showInLegend: true,
                toolTipContent: "{name}: <strong>{y}</strong>",
                indexLabel: "{name} - {y}",
                dataPoints: statusPieDataPoints
            }]
        };

        const predefinedColors = ["red", "blue", "green", "orange", "purple", "yellow", "cyan", "magenta", "lime", "pink"];
        const scatterOptions = {
            exportEnabled: true,
            animationEnabled: true,
            title: { text: "Leave Count vs Date" },
            axisX: { title: "Date", valueFormatString: "DD MMM YYYY" },
            axisY: { title: "Leave Count" },
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
                <h1 className="headingleave" align="center">Employee Leave Analysis</h1>
                <div className="leaveAnalysisContainer">
                    <div style={{ display: "inline-block", width: "50%" }}>
                        <CanvasJSChart options={columnOptions} />
                    </div>
                    <div style={{ display: "inline-block", width: "50%" }}>
                        <CanvasJSChart options={typePieOptions} />
                    </div>
                    <div style={{ display: "inline-block", width: "50%" }}>
                        <CanvasJSChart options={statusPieOptions} />
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
